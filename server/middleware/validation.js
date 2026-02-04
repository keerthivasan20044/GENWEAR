import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * Auth Validation Rules
 */
export const registerValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

/**
 * Product Validation Rules
 */
export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3-200 characters'),
    body('slug')
        .trim()
        .notEmpty().withMessage('Slug is required')
        .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('sku')
        .trim()
        .notEmpty().withMessage('SKU is required'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['topwear', 'bottomwear', 'outerwear', 'accessories', 'footwear']).withMessage('Invalid category'),
    body('gender')
        .notEmpty().withMessage('Gender is required')
        .isIn(['men', 'women', 'kids', 'unisex']).withMessage('Invalid gender'),
    validate
];

export const updateProductValidation = [
    param('id')
        .isMongoId().withMessage('Invalid product ID'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3-200 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate
];

/**
 * Cart Validation Rules
 */
export const addToCartValidation = [
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    body('size')
        .notEmpty().withMessage('Size is required'),
    body('color')
        .notEmpty().withMessage('Color is required'),
    validate
];

export const updateCartValidation = [
    param('id')
        .isMongoId().withMessage('Invalid cart item ID'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    validate
];

/**
 * Order Validation Rules
 */
export const createOrderValidation = [
    body('orderItems')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('orderItems.*.product')
        .isMongoId().withMessage('Invalid product ID'),
    body('orderItems.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.addressLine')
        .notEmpty().withMessage('Address line is required'),
    body('shippingAddress.city')
        .notEmpty().withMessage('City is required'),
    body('shippingAddress.state')
        .notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode')
        .notEmpty().withMessage('Pincode is required')
        .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
    body('shippingAddress.phone')
        .notEmpty().withMessage('Phone is required')
        .matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['COD', 'Card', 'UPI']).withMessage('Invalid payment method'),
    body('pricing.subtotal')
        .isFloat({ min: 0 }).withMessage('Invalid subtotal'),
    body('pricing.total')
        .isFloat({ min: 0 }).withMessage('Invalid total'),
    validate
];

/**
 * Query Parameter Validation
 */
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate
];

export const mongoIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
    validate
];

/**
 * Search Validation
 */
export const searchValidation = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1-100 characters'),
    validate
];
