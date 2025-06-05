import { Item, OptionalId } from 'type/entity'

export type ItemMoveBody = {
    packageId: string
    itemIds: string
}

export type ItemMoveParams = {
    packageId: string
    itemIds: string[]
}

export type ItemMoveResponse =
    | {
          meta: ItemMoveParams
          data: Item[]
      }
    | {
          error: string
          details?: any
      }
