import { Router } from 'express'
import { itemRouter } from './item'
import { packageRouter } from './package'

export const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})


const privateRouter = Router()
router.use(privateRouter)

privateRouter.use('/item', itemRouter)
privateRouter.use('/package', packageRouter)
