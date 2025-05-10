import { Router } from 'express'
import { itemRouter } from './item'
import { login } from './login'
import { authMiddleware } from 'middleware/auth'
import { packageRouter } from './package'

export const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})

router.post('/login', login)

const privateRouter = Router()
privateRouter.use(authMiddleware)
router.use(privateRouter)

privateRouter.use('/item', itemRouter)
privateRouter.use('/package', packageRouter)
