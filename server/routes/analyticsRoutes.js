import express from 'express'
import {
    trackAction,
    getDashboardAnalytics,
    getProductAnalytics,
    getCustomerAnalytics,
    getSalesReport
} from '../controllers/analyticsController.js'
import { authenticate, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/track', trackAction)

// Admin routes
router.get('/dashboard', authenticate, adminOnly, getDashboardAnalytics)
router.get('/products', authenticate, adminOnly, getProductAnalytics)
router.get('/customers', authenticate, adminOnly, getCustomerAnalytics)
router.get('/sales-report', authenticate, adminOnly, getSalesReport)

export default router