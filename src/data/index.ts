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
        database: process.env.DB_NAME ?? process.env.POSTGRES_USER,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    })
}

export const generateGeneralFuzzyClause = ({
    sql,
    fields,
    value,
    tablePrefix,
}: {
    sql: postgres.Sql,
    fields: string[]
    value: string
    tablePrefix?: string
}) => {
    const hasGeneralFuzzy = fields.length > 0
    const generalFuzzyClause = fields?.length
        ? sql.unsafe(
              fields
                  .map(
                      (field) =>
                          `${tablePrefix ?? ''}${field} ILIKE '${'%' + value + '%'}'`
                  )
                  .join(' OR ')
          )
        : sql``

    return {
        hasGeneralFuzzy,
        generalFuzzyClause,
    }
}

export const generateSpecificFuzzyClause = ({
    sql,
    fields,
    tablePrefix,
}: {
    sql: postgres.Sql,
    fields: Record<string, string | undefined>
    tablePrefix?: string
}) => {
    const hasSpecificFuzzy = Object.entries(fields ?? {}).some(([_, value]) => !!value)
    const specificFuzzyClause = sql.unsafe(
        Object.entries(fields ?? {})
            .filter(([_, value]) => !!value)
            .map(([field, value]) => `${tablePrefix ?? ''}${field} ILIKE '${'%' + value + '%'}'`)
            .join(' AND ')
    )

    return {
        hasSpecificFuzzy,
        specificFuzzyClause,
    }
}