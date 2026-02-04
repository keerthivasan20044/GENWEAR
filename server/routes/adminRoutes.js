import express from 'express'
import {
    getDashboard,
    getCustomers,
    toggleBlockCustomer,
    getCustomerProfile,
} from '../controllers/adminController.js'
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate, authorizeAdmin)

router.get('/dashboard', getDashboard)
router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomerProfile)
router.put('/customers/:id/block', toggleBlockCustomer)

export default router
