import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { registerValidation, loginValidation } from '../middleware/validation.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.get('/me', authenticate, getMe)

export default router
