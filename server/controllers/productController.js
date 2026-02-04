import Product from '../models/Product.js'
import { validationResult } from 'express-validator'
import logger from '../utils/logger.js'

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            gender,
            category,
            colors,
            sizes,
            materials,
            fits,
            brands,
            minPrice,
            maxPrice,
            inStock,
            sort,
            search,
            page = 1,
            limit = 12
        } = req.query

        const query = { isActive: true }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ]
        }

        // Gender filter
        if (gender) {
            const genders = Array.isArray(gender) ? gender : gender.split(',')
            query.gender = { $in: genders }
        }

        // Category filter
        if (category) {
            const categories = Array.isArray(category) ? category : category.split(',')
            query.category = { $in: categories }
        }

        // Materials filter
        if (materials) {
            const materialArray = Array.isArray(materials) ? materials : materials.split(',')
            query.material = { $in: materialArray }
        }

        // Fits filter
        if (fits) {
            const fitArray = Array.isArray(fits) ? fits : fits.split(',')
            query.fit = { $in: fitArray }
        }

        // Brands filter
        if (brands) {
            const brandArray = Array.isArray(brands) ? brands : brands.split(',')
            query.brand = { $in: brandArray }
        }

        // Colors filter
        if (colors) {
            const colorArray = Array.isArray(colors) ? colors : colors.split(',')
            query['colors.name'] = { $in: colorArray }
        }

        // Sizes filter
        if (sizes) {
            const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',')
            query['sizes.size'] = { $in: sizeArray }
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        // Stock status
        if (inStock === 'true') {
            query.stock = { $gt: 0 }
        }

        // Sorting
        let sortObj = { createdAt: -1 }
        if (sort) {
            switch (sort) {
                case 'price_asc': sortObj = { price: 1 }; break;
                case 'price_desc': sortObj = { price: -1 }; break;
                case 'popular': sortObj = { 'rating.average': -1 }; break;
                case 'newest': sortObj = { createdAt: -1 }; break;
                default: sortObj = { createdAt: -1 }
            }
        }

        const skip = (Number(page) - 1) * Number(limit)
        const products = await Product.find(query)
            .sort(sortObj)
            .limit(Number(limit))
            .skip(skip)

        const total = await Product.countDocuments(query)

        res.json({
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        logger.error('Get products error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        logger.error('Get product by ID error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Search products (Live results)
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query
        if (!q) return res.json([])

        const products = await Product.find({
            isActive: true,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } }
            ]
        }).limit(5).select('name slug images price brand')

        res.json(products)
    } catch (error) {
        logger.error('Search products error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// Admin Controllers
export const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        logger.error('Create product error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.json(product)
    } catch (error) {
        logger.error('Update product error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found' })

        product.isActive = false
        await product.save()
        res.json({ message: 'Product deactivated' })
    } catch (error) {
        logger.error('Delete product error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}
