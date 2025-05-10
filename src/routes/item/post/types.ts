import { Item, OptionalId } from 'type/entity'

export type ItemPostBody = {
    record: OptionalId<Item>
}

export type ItemPostParams = ItemPostBody & {}

export type ItemPostResponse =
    | {
          meta: ItemPostParams
          data: Item[]
      }
    | {
          error: string
          details?: any
      }
