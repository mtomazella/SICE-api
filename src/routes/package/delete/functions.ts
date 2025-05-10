import { Request } from 'express'
import { PackageDeleteParams, PackageDeleteRequest } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, {}, PackageDeleteRequest>
): PackageDeleteParams => {
    const { id } = req.query ?? {}

    const params: PackageDeleteParams = {} as PackageDeleteParams

    if (!id || typeof id !== 'string') {
        throw new RequestParameterValidationError(
            'Invalid or missing id parameter'
        )
    }
    params.id = id

    return params
}
