import { Router } from 'express'
import { itemGet } from './get'
import { itemPost } from './post'
import { itemDelete } from './delete'

export const clientRouter = Router()

clientRouter.get('/', itemGet)
clientRouter.post('/', itemPost)
clientRouter.delete('/', itemDelete)
