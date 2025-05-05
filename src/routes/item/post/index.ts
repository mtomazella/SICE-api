import { Request, RequestHandler, Response } from 'express'
import { PostItem } from './types'
import { upsert } from 'data/item'

export const postItemEndpoint: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    // TODO: auth
    const userId = '1'

    const validateString = (str: string) => {
        return str && typeof str === 'string' && str.trim().length > 0
    }
    const stringOrUndefined = (str: string | undefined) => {
        return str && typeof str === 'string' && str.trim().length > 0
            ? str.trim()
            : undefined
    }

    let item: PostItem
    try {
        const rawItem = req?.body?.item ?? {}

        if (!rawItem) {
            return res.status(400).json({ error: 'Invalid item' })
        }

        let name
        if (validateString(rawItem.name)) {
            name = rawItem.name.trim()
        } else {
            return res.status(400).json({ error: 'Invalid name' })
        }

        item = {
            id: stringOrUndefined(rawItem.id),
            name,
            tagId: stringOrUndefined(rawItem.tagId),
            description: stringOrUndefined(rawItem.description),
            categoryId: stringOrUndefined(rawItem.categoryId),
            packageId: stringOrUndefined(rawItem.packageId),
            userId,
        }
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to parse item', details: error.toString() })
    }

    try {
        const result = upsert({ item })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to handle request' })
    }
}
