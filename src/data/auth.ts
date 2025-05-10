import { User } from "type/entity";
import { createPostgresClient } from ".";

export const getLoginUser = async ({ username, password }: { username: string; password: string }) => {
    const sql = createPostgresClient()

    const user = await sql<{ id: string }[]>`
        SELECT id FROM "user"
        WHERE email = ${username}
        AND password = ${password}
        AND deletedAt IS NULL
    `

    return user[0]
}