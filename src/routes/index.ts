import { Router } from 'express'
import { clientRouter } from './item'
import { login } from './login'
import { authMiddleware } from 'middleware/auth'

export const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})

router.post('/login', login)

const privateRouter = Router()
privateRouter.use(authMiddleware)
router.use(privateRouter)

privateRouter.use('/item', clientRouter)
