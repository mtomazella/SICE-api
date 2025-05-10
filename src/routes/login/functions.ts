import { Request } from "express"
import { LoginParams, LoginBody } from "./types"
import { RequestParameterValidationError } from "error/index"

export const extractParams = (
    req: Request<{}, {}, LoginBody, {}>
): LoginParams => {
    const {
        username,
        password,
    } = req.body ?? {}

    const params: LoginParams = {
    } as LoginParams

    if (!username) {
        throw new RequestParameterValidationError('Missing username')
    }
    params.username = username

    if (!password) {
        throw new RequestParameterValidationError('Missing password')
    }
    params.password = password

    return params
}