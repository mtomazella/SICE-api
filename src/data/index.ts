import postgres from 'postgres'

export const createPostgresClient = () => {
    if (!process.env.POSTGRES_USER) {
        throw new Error('POSTGRES_USER is not set')
    }
    if (!process.env.POSTGRES_PASSWORD) {
        throw new Error('POSTGRES_PASSWORD is not set')
    }
    return postgres({
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.POSTGRES_USER,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    })
}
