import { Router } from 'express'
import { itemRouter } from './item'

export const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})

router.use('/item', itemRouter)
