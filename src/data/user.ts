import { PostgresError } from 'postgres'
import {
    createPostgresClient,
    generateGeneralFuzzyClause,
    generateSpecificFuzzyClause,
} from './index'
import { IncludePassword, OptionalId, User } from 'type/entity'
import { SelectError, UpsertError } from 'error/index'

export const list = async ({
    id,
    page,
    generalFuzzy,
    fuzzy,
    limit,
    includePermissions = true,
}: {
    id?: string
    generalFuzzy?: {
        value?: string
        fields?: Array<'name' | 'role' | 'email'>
    }
    fuzzy?: {
        name?: string
        role?: string
        email?: string
    }
    page: number
    limit: number
    includePermissions?: boolean
}): Promise<{
    data: User[]
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
        throw new SelectError(
            'If using general fuzzy search, do not use other fuzzy search'
        )
    }

    const sql = createPostgresClient()

    const { hasGeneralFuzzy, generalFuzzyClause } = generateGeneralFuzzyClause({
        sql,
        fields: generalFuzzy?.fields ?? [],
        value: generalFuzzy?.value ?? '',
        tablePrefix: 'u.',
    })

    const { hasSpecificFuzzy, specificFuzzyClause } =
        generateSpecificFuzzyClause({
            sql,
            fields: fuzzy ?? {},
            tablePrefix: 'u.',
        })

    const query = await sql<(User & { total_count: number })[]>`
        SELECT  
            u.id,
            u.name,
            u.role,
            u.email,
            u.createdAt,
            u.updatedAt,
            u.deletedAt,
            COUNT(*) OVER() AS total_count
            ${
                includePermissions
                    ? sql`
                    ,
                    ARRAY_REMOVE(ARRAY_AGG(p.id), NULL) AS permissions
                `
                    : sql``
            }
        FROM "user" u 
        ${
            includePermissions
                ? sql`
                LEFT JOIN user_permission up ON up.userId = u.id
                LEFT JOIN permission p ON p.id = up.permissionId
            `
                : sql``
        }
        WHERE 1 = 1 
            ${id ? sql`AND u.id = ${id}` : sql``}
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
        ${
            includePermissions
                ? sql`
                GROUP BY u.id
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
        data: query.map((user) => {
            delete (user as any).total_count
            return user
        }),
        page,
        limit,
    }
}

export const upsert = async ({
    record,
}: {
    record: IncludePassword<OptionalId<User>>
}) => {
    try {
        const sql = createPostgresClient()

        const query = await sql<User[]>`
        INSERT INTO "user" (id, name, role, email, password)
        VALUES (
            ${record.id ?? sql`DEFAULT`},
            ${record.name},
            ${record.role ?? sql`DEFAULT`},
            ${record.email},
            ${record.password}
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            email = EXCLUDED.email,
            password = EXCLUDED.password,
            updatedAt = NOW()
        RETURNING *;
    `

        return query
    } catch (error) {
        if (error instanceof PostgresError) {
            if (error.code === '23505') {
                throw new UpsertError(
                    'User with unique identifiers already exists'
                )
            }
            if (error.code === '22001') {
                throw new UpsertError('User data exceeds maximum length')
            }
        }

        console.error('Error upserting user:', error)
        throw error
    }
}

export const remove = async ({ id }: { id: string }) => {
    try {
        const sql = createPostgresClient()

        const query = await sql<User[]>`
        DELETE FROM "user" WHERE id = ${id} RETURNING *;
    `

        return query
    } catch (error) {
        if (error instanceof PostgresError) {
            if (error.code === '23503') {
                throw new UpsertError(
                    'User cannot be deleted due to foreign key constraints'
                )
            }
        }

        console.error('Error deleting user:', error)
        throw error
    }
}
