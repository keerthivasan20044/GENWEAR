import express from 'express'
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus
} from '../controllers/orderController.js'
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'
import { createOrderValidation, mongoIdValidation } from '../middleware/validation.js'

const router = express.Router()

router.post('/', authenticate, createOrderValidation, createOrder)
router.get('/myorders', authenticate, getMyOrders)
router.get('/:id', authenticate, mongoIdValidation, getOrderById)

// Admin Routes
router.get('/', authenticate, authorizeAdmin, getOrders)
router.put('/:id/status', authenticate, authorizeAdmin, mongoIdValidation, updateOrderStatus)

export default router
