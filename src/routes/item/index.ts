import { Router } from 'express'
import { itemGet } from './get'
import { itemPost } from './post'
import { itemDelete } from './delete'
import { itemMove } from './move'

export const itemRouter = Router()

itemRouter.get('/', itemGet)
itemRouter.post('/', itemPost)
itemRouter.delete('/', itemDelete)
itemRouter.post('/move', itemMove)