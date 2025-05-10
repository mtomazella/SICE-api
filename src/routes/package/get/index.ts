import { list } from 'data/package'
import { PermissionError, RequestParameterValidationError } from 'error/index'
import { Handler, Request, Response } from 'express'
import { PackageGetRequest, PackageGetResponse } from './types'
import { extractParams } from './functions'
import { checkPermissions } from 'auth/permissions'
import {
    BadRequest,
    Forbidden,
    InternalServerError,
    Success,
} from 'utils/response'

export const packageGet: Handler = async (
    req: Request<{}, {}, {}, PackageGetRequest>,
    res: Response<PackageGetResponse>
): Promise<any> => {
    try {
        checkPermissions({
            userPermissions: res.locals?.user?.permissions,
            requiredPermissions: ['package:list'],
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

        let listResult
        try {
            listResult = await list({ ...params })
        } catch (error) {
            console.error('Error fetching packages:', error)
            return InternalServerError(res, 'Failed to fetch packages')
        }

        return Success(res, {
            meta: params,
            count: listResult.count,
            data: listResult.data,
        })
    } catch (error) {
        if (error instanceof PermissionError) {
            return Forbidden(res, error.message)
        }

        console.error('Error in packageGet handler:', error)
        return InternalServerError(res)
    }
}
