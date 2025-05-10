import { upsert } from 'data/package'
import {
    PermissionError,
    RequestParameterValidationError,
    UpsertError,
} from 'error/index'
import { Handler, Request, Response } from 'express'
import { PackagePostBody, PackagePostResponse } from './types'
import { extractParams } from './functions'
import {
    BadRequest,
    Conflict,
    Forbidden,
    InternalServerError,
    Success,
} from 'utils/response'
import { checkPermissions } from 'auth/permissions'

export const packagePost: Handler = async (
    req: Request<{}, {}, PackagePostBody, {}>,
    res: Response<PackagePostResponse>
): Promise<any> => {
    try {
        const user = res.locals?.user
        checkPermissions({
            userPermissions: user?.permissions,
            requiredPermissions: ['package:upsert'],
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
            result = await upsert({
                record: { ...params.record },
            })
        } catch (error) {
            if (error instanceof UpsertError) {
                return Conflict(res, error.message)
            }
            console.error('Error upserting package:', error)
            return InternalServerError(res, 'Failed to upsert package')
        }

        return Success(res, {
            meta: params,
            data: result,
        })
    } catch (error) {
        if (error instanceof PermissionError) {
            return Forbidden(res, error.message)
        }

        console.error('Error in packagePost handler:', error)
        return InternalServerError(res)
    }
}
