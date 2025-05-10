import { PostgresError } from 'postgres'
import {
    createPostgresClient,
    generateGeneralFuzzyClause,
    generateSpecificFuzzyClause,
} from './index'
import { OptionalId, Item } from 'type/entity'
import { UpsertError } from 'error/index'

export const list = async ({
    id,
    page,
    generalFuzzy,
    fuzzy,
    limit,
}: {
    id?: string
    generalFuzzy?: {
        value?: string
        fields?: Array<'name' | 'description'>
    }
    fuzzy?: {
        name?: string
        description?: string
    }
    page: number
    limit: number
}): Promise<{
    data: Item[]
    count: {
        page: number
        total: number
    }
    page: number
    limit: number
}> => {
    if (page < 1) {
        throw new Error('Page must be greater than 0')
    }

    if (
        generalFuzzy?.fields?.length &&
        Object.values(fuzzy ?? {}).filter((v: any) => !!v).length
    ) {
        throw new Error(
            'If using general fuzzy search, do not use other fuzzy search'
        )
    }

    const sql = createPostgresClient()

    const { hasGeneralFuzzy, generalFuzzyClause } = generateGeneralFuzzyClause({
        sql,
        fields: generalFuzzy?.fields ?? [],
        value: generalFuzzy?.value ?? '',
    })

    const { hasSpecificFuzzy, specificFuzzyClause } =
        generateSpecificFuzzyClause({
            sql,
            fields: fuzzy ?? {},
        })

    const query = await sql<(Item & { total_count: number })[]>`
        SELECT 
            *,
            COUNT(*) OVER() AS total_count
        FROM item WHERE 1 = 1 ${id ? sql`AND id = ${id}` : sql``}
        ${
            hasGeneralFuzzy
                ? sql`AND ( 
                    ${generalFuzzyClause}
                )
            `
                : sql``
        }
        ${
            hasSpecificFuzzy
                ? sql`AND ( 
                    ${specificFuzzyClause}
                )
            `
                : sql``
        }
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `

    return {
        count: {
            page: query.length,
            total: Number(query[0]?.total_count ?? 0),
        },
        data: query.map((client) => {
            delete (client as any).total_count
            return client
        }),
        page,
        limit,
    }
}

export const upsert = async ({ record }: { record: OptionalId<Item> }) => {
    try {
        const sql = createPostgresClient()

        const query = await sql<Item[]>`
        INSERT INTO item (id, name, description, categoryId, packageId, userId)
        VALUES (
            ${record.id ?? sql`DEFAULT`},
            ${record.name},
            ${record.description ?? sql`DEFAULT`},
            ${record.categoryId ?? sql`DEFAULT`},
            ${record.packageId ?? sql`DEFAULT`},
            ${record.userId}
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            categoryId = EXCLUDED.categoryId,
            packageId = EXCLUDED.packageId,
            userId = EXCLUDED.userId,
            updatedAt = NOW()
        RETURNING *;
    `

        return query
    } catch (error) {
        if (error instanceof PostgresError) {
            if (error.code === '23505') {
                throw new UpsertError(
                    'Client with unique identifiers already exists'
                )
            }
            if (error.code === '22001') {
                throw new UpsertError('Item data exceeds maximum length')
            }
        }

        console.error('Error upserting item:', error)
        throw error
    }
}

export const remove = async ({ id }: { id: string }) => {
    try {
        const sql = createPostgresClient()

        const query = await sql<Item[]>`
        DELETE FROM item WHERE id = ${id} RETURNING *;
    `

        return query
    } catch (error) {
        if (error instanceof PostgresError) {
            if (error.code === '23503') {
                throw new UpsertError(
                    'Item cannot be deleted due to foreign key constraints'
                )
            }
        }

        console.error('Error deleting client:', error)
        throw error
    }
}
