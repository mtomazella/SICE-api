import { Request } from 'express'
import { ItemGetParams, ItemGetRequest } from './types'
import { RequestParameterValidationError } from 'error/index'

export const extractParams = (
    req: Request<{}, {}, {}, ItemGetRequest>
): ItemGetParams => {
    const { id, packageId, fuzzyName, fuzzyDescription, page, limit } =
        req.query

    const params: ItemGetParams = {
        generalFuzzy: {},
        fuzzy: {},
    } as ItemGetParams

    if (!!id && typeof id !== 'string') {
        throw new RequestParameterValidationError('Invalid id')
    }
    params.id = id

    if (!!packageId && typeof packageId !== 'string') {
        throw new RequestParameterValidationError('Invalid packageId')
    }
    params.packageId = packageId

    if (!page) {
        params.page = 1
    } else {
        const numberPage = Number(page)
        if (isNaN(numberPage)) {
            throw new RequestParameterValidationError('Invalid page')
        }
        params.page = numberPage
    }

    if (!limit) {
        params.limit = 10
    } else {
        const numberLimit = Number(limit)
        if (isNaN(numberLimit)) {
            throw new RequestParameterValidationError('Invalid limit')
        }
        params.limit = numberLimit
    }

    if (fuzzyName && typeof fuzzyName !== 'string') {
        throw new RequestParameterValidationError('Invalid fuzzyName')
    }
    params.fuzzy.name = fuzzyName

    if (fuzzyDescription && typeof fuzzyDescription !== 'string') {
        throw new RequestParameterValidationError('Invalid fuzzyDescription')
    }
    params.fuzzy.description = fuzzyDescription

    if (
        req.query.generalFuzzyValue &&
        typeof req.query.generalFuzzyValue !== 'string'
    ) {
        throw new RequestParameterValidationError('Invalid generalFuzzyValue')
    }
    params.generalFuzzy.value = req.query.generalFuzzyValue

    if (params.generalFuzzy.value && !params.generalFuzzy.fields?.length) {
        params.generalFuzzy.fields = ['name', 'description']
    } else {
        if (
            req.query.generalFuzzyFields &&
            typeof req.query.generalFuzzyFields !== 'string'
        ) {
            throw new RequestParameterValidationError(
                'Invalid generalFuzzyFields'
            )
        }
        params.generalFuzzy.fields = (req.query.generalFuzzyFields ?? '')
            .split(',')
            .map((field) => field.trim())
            .filter((field) =>
                ['name', 'description'].includes(field)
            ) as Array<'name' | 'description'>
    }

    return params
}
