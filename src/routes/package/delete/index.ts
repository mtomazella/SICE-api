import { remove } from 'data/item'
import {
    PermissionError,
    RequestParameterValidationError,
    UpsertError,
} from 'error/index'
import { Request, Response } from 'express'
import { PackageDeleteRequest, PackageDeleteResponse } from './types'
import { extractParams } from './functions'
import {
    BadRequest,
    Conflict,
    Forbidden,
    InternalServerError,
    Success,
} from 'utils/response'
import { checkPermissions } from 'auth/permissions'

export const packageDelete = async (
    req: Request<{}, {}, {}, PackageDeleteRequest>,
    res: Response<PackageDeleteResponse>
): Promise<any> => {
    try {
        checkPermissions({
            userPermissions: res.locals?.user?.permissions,
            requiredPermissions: ['package:delete'],
        })

        let params
        try {
            params = extractParams(req)
        } catch (error) {
            if (error instanceof RequestParameterValidationError) {
                return BadRequest(res, error.message)
            }
            throw error
        }

        let result
        try {
            result = await remove(params)
        } catch (error) {
            if (error instanceof UpsertError) {
                return Conflict(res, error.message)
            }

            console.error('Error deleting package:', error)
            return InternalServerError(res, 'Failed to delete package')
        }

        return Success(res, {
            meta: params,
            data: result,
        })
    } catch (error) {
        if (error instanceof PermissionError) {
            return Forbidden(res, error.message)
        }

        console.error('Error in packageDelete handler:', error)
        return InternalServerError(res)
    }
}
