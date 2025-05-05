type DatabaseDates = {
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

type IncludeDates<T> = T & DatabaseDates

export type OptionalId<T> = T & { id?: string }
export type RequiredId<T> = T & { id: string }

export type OptionalUserId<T> = T & { userId?: string }
export type RequiredUserId<T> = T & { userId: string }

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
