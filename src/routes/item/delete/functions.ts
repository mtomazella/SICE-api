import { Request } from 'express'
import { ItemDeleteParams, ItemDeleteRequest } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, {}, ItemDeleteRequest>
): ItemDeleteParams => {
    const { id } = req.query ?? {}

    const params: ItemDeleteParams = {} as ItemDeleteParams

    if (!id || typeof id !== 'string') {
        throw new RequestParameterValidationError(
            'Invalid or missing id parameter'
        )
    }
    params.id = id

    return params
}
