import { move, upsert } from 'data/item'
import {
    PermissionError,
    RequestParameterValidationError,
    UpsertError,
} from 'error/index'
import { Handler, Request, Response } from 'express'
import { ItemMoveBody, ItemMoveResponse } from './types'
import { extractParams } from './functions'
import {
    BadRequest,
    Conflict,
    Forbidden,
    InternalServerError,
    Success,
} from 'utils/response'
import { checkPermissions } from 'auth/permissions'

export const itemMove: Handler = async (
    req: Request<{}, {}, ItemMoveBody, {}>,
    res: Response<ItemMoveResponse>
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

        let results = []
        let errors = []
        for (const itemId of params.itemIds) {
            try {
                results.push(await move({
                    packageId: params.packageId,
                    itemId,
                }))
            } catch (error) {
                if (error instanceof UpsertError) {
                    errors.push({
                        itemId,
                        error: error.message,
                    })
                }
                console.error('Error upserting item:', error)
                errors.push({
                    itemId,
                    error: 'Failed to upsert item',
                })
            }
        }

        return Success(res, {
            meta: params,
            data: {
                results,
                errors,
            },
        })
    } catch (error) {
        if (error instanceof PermissionError) {
            return Forbidden(res, error.message)
        }

        console.error('Error in itemPost handler:', error)
        return InternalServerError(res)
    }
}
