import { Item } from 'type/entity'

export type ItemGetRequest = {
    id?: string
    packageId?: string
    fuzzyName?: string
    fuzzyDescription?: string
    generalFuzzyValue?: string
    generalFuzzyFields?: Array<'name' | 'description'>
    page?: number
    limit?: number
}

export type ItemGetParams = ItemGetRequest & {
    id?: string
    packageId?: string
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

export type ItemGetResponse =
    | {
          meta: ItemGetParams
          count: {
              total: number
              page: number
          }
          data: Item[]
      }
    | {
          error: string
      }
