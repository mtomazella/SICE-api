import { upsert } from 'data/item'
import {
    PermissionError,
    RequestParameterValidationError,
    UpsertError,
} from 'error/index'
import { Handler, Request, Response } from 'express'
import { ItemPostBody, ItemPostResponse } from './types'
import { extractParams } from './functions'
import {
    BadRequest,
    Conflict,
    Forbidden,
    InternalServerError,
    Success,
} from 'utils/response'
import { checkPermissions } from 'auth/permissions'

export const itemPost: Handler = async (
    req: Request<{}, {}, ItemPostBody, {}>,
    res: Response<ItemPostResponse>
): Promise<any> => {
    try {
        const user = res.locals?.user
        checkPermissions({
            userPermissions: user?.permissions,
            requiredPermissions: ['item:upsert'],
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
                record: { ...params.record, userId: user?.id },
            })
        } catch (error) {
            if (error instanceof UpsertError) {
                return Conflict(res, error.message)
            }
            console.error('Error upserting item:', error)
            return InternalServerError(res, 'Failed to upsert item')
        }

        return Success(res, {
            meta: params,
            data: result,
        })
    } catch (error) {
        if (error instanceof PermissionError) {
            return Forbidden(res, error.message)
        }

        console.error('Error in itemPost handler:', error)
        return InternalServerError(res)
    }
}
