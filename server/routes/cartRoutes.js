import express from 'express'
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from '../controllers/cartController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { addToCartValidation, updateCartValidation, mongoIdValidation } from '../middleware/validation.js'

const router = express.Router()

router.use(authenticate)

router.get('/', getCart)
router.post('/', addToCartValidation, addToCart)
router.put('/:id', updateCartValidation, updateCartItem)
router.delete('/:id', mongoIdValidation, removeCartItem)
router.post('/clear', clearCart)

export default router
