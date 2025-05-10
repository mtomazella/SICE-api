export const permissions = ['client:list', 'client:upsert', 'client:delete']

export type Permission = (typeof permissions)[number]
