import { Request } from 'express'
import { ItemMoveParams, ItemMoveBody } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, ItemMoveBody, {}>
): ItemMoveParams => {
    const { packageId, itemIds } = req.body ?? {}

    const params: ItemMoveParams = {} as ItemMoveParams

    if (!packageId) {
        throw new RequestParameterValidationError(
            'Missing packageId in request body'
        )
    }
    params.packageId = packageId

    if (!itemIds) {
        throw new RequestParameterValidationError('Missing itemIds in request body')
    }
    params.itemIds = itemIds.split(',').map((id) => id.trim())

    return params
}
