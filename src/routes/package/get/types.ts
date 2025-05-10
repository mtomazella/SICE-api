import { Package } from 'type/entity'

export type PackageGetRequest = {
    id?: string
    fuzzyName?: string
    fuzzyDescription?: string
    generalFuzzyValue?: string
    generalFuzzyFields?: Array<'name' | 'description'>
    page?: number
    limit?: number
}

export type PackageGetParams = PackageGetRequest & {
    id?: string
    generalFuzzy: {
        value?: string
        fields?: Array<'name' | 'description'>
    }
    fuzzy: {
        name?: string
        description?: string
    }
    page: number
    limit: number
}

export type PackageGetResponse =
    | {
          meta: PackageGetParams
          count: {
              total: number
              page: number
          }
          data: Package[]
      }
    | {
          error: string
      }
