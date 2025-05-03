import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
    port: number
    nodeEnv: string
    postgres: {
        user: string
        password: string
        host: string
        port: number
        database: string
    }
}

if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD environment variable is required')
}

const config: Config = {
    port: Number(process.env.PORT) ?? 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    postgres: {
        user: process.env.POSTGRES_USER ?? 'novadmin',
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST ?? 'localhost',
        port: Number(process.env.POSTGRES_PORT) ?? 5432,
        database: process.env.POSTGRES_DB ?? 'novadmin',
    },
}

export default config
