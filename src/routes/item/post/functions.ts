import { Request } from 'express'
import { ItemPostParams, ItemPostBody } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, ItemPostBody, {}>
): ItemPostParams => {
    const { record } = req.body ?? {}

    const params: ItemPostParams = {} as ItemPostParams

    if (!record) {
        throw new RequestParameterValidationError(
            'Missing record in request body'
        )
    }

    if (!record.name) {
        throw new RequestParameterValidationError('Missing name in record')
    } else if (record.name.length > 115) {
        throw new RequestParameterValidationError('Name is too long')
    }

    params.record = record

    return params
}
