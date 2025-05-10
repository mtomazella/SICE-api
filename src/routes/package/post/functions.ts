import { Request } from 'express'
import { PackagePostParams, PackagePostBody } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, PackagePostBody, {}>
): PackagePostParams => {
    const { record } = req.body ?? {}

    const params: PackagePostParams = {} as PackagePostParams

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
