import { Item } from 'type/entity'

export type ItemDeleteRequest = {
    id: string
}

export type ItemDeleteParams = ItemDeleteRequest & {}

export type ItemDeleteResponse =
    | {
          meta: ItemDeleteParams
          data: Item[]
      }
    | {
          error: string
          details?: any
      }
