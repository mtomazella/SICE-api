export type OptionalId<T> = T & {
    id?: string
}
export type RequiredId<T> = T & { id: string }

export type OptionalUserId<T> = T & { userId?: string }
export type RequiredUserId<T> = T & { userId: string }

type DatabaseDates = {
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export type IncludePassword<T> = T & { password: string }
export type User = {
    id: string
    name: string
    role?: string
    email: string
}

type IncludeDates<T> = T & DatabaseDates

export type InputItem = {
    id?: string
    tagId?: string
    name: string
    description?: string
    categoryId?: string
    packageId?: string
    userId: string
}
export type Item = RequiredId<IncludeDates<InputItem>>

export type Package = {
    id: string
    name: string
    description?: string
    tagId?: string
}
