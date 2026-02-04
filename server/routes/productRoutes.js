import express from 'express'
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} from '../controllers/productController.js'
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'
import { 
    createProductValidation, 
    updateProductValidation, 
    mongoIdValidation,
    paginationValidation,
    searchValidation 
} from '../middleware/validation.js'

const router = express.Router()

router.get('/', paginationValidation, getProducts)
router.get('/search', searchValidation, searchProducts)
router.get('/:id', mongoIdValidation, getProductById)

// Admin Routes
router.post('/', authenticate, authorizeAdmin, createProductValidation, createProduct)
router.put('/:id', authenticate, authorizeAdmin, updateProductValidation, updateProduct)
router.delete('/:id', authenticate, authorizeAdmin, mongoIdValidation, deleteProduct)

export default router
