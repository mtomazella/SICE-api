import { Router } from 'express'
import { packageGet } from './get'
import { packagePost } from './post'
import { packageDelete } from './delete'

export const packageRouter = Router()

packageRouter.get('/', packageGet)
packageRouter.post('/', packagePost)
packageRouter.delete('/', packageDelete)
