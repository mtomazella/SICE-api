import { createPostgresClient } from './'
import { InputItem } from 'types'

export const upsert = async ({ item }: { item: InputItem }) => {
    const client = createPostgresClient()

    const result = await client`
        INSERT INTO item (name, description, tagId, categoryId, packageId, userId)
        VALUES (${item.name}, ${item.description ?? null}, ${item.tagId ?? null}, ${item.categoryId ?? null}, ${item.packageId ?? null}, ${item.userId})
        ON CONFLICT (id) DO UPDATE
        SET name = excluded.name,
            description = excluded.description,
            tagId = excluded.tagId,
            categoryId = excluded.categoryId,
            packageId = excluded.packageId,
            userId = excluded.userId
        RETURNING *
    `

    return result
}
