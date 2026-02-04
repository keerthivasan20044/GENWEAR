import Product from '../models/Product.js'
import { Analytics } from '../models/Analytics.js'
import logger from '../utils/logger.js'

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            gender,
            minPrice,
            maxPrice,
            brand,
            color,
            size,
            sort = 'createdAt',
            order = 'desc',
            search,
            isNew,
            isFeatured,
            inStock = true
        } = req.query

        const query = { isActive: true }
        
        if (inStock === 'true') query.stock = { $gt: 0 }
        if (category) query.category = category
        if (gender) query.gender = gender
        if (brand) query.brand = { $regex: brand, $options: 'i' }
        if (color) query.colors = { $in: [color] }
        if (size) query.sizes = { $in: [size] }
        if (isNew === 'true') query.isNew = true
        if (isFeatured === 'true') query.isFeatured = true
        
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ]
        }

        const sortOrder = order === 'desc' ? -1 : 1
        const sortObj = {}
        sortObj[sort] = sortOrder

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const skip = (pageNum - 1) * limitNum

        const products = await Product.find(query)
            .sort(sortObj)
            .limit(limitNum)
            .skip(skip)
            .populate('reviews', 'rating')

        const totalProducts = await Product.countDocuments(query)
        const totalPages = Math.ceil(totalProducts / limitNum)

        // Track search analytics
        if (search && req.user) {
            const analytics = new Analytics({
                type: 'search',
                userId: req.user._id,
                data: {
                    searchTerm: search,
                    resultsCount: totalProducts,
                    filters: { category, gender, minPrice, maxPrice, brand }
                }
            })
            await analytics.save()
        }

        res.json({
            products,
            pagination: {
                page: pageNum,
                totalPages,
                totalProducts,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            filters: {
                categories: await Product.distinct('category', { isActive: true }),
                brands: await Product.distinct('brand', { isActive: true }),
                colors: await Product.distinct('colors', { isActive: true }),
                sizes: await Product.distinct('sizes', { isActive: true }),
                priceRange: await Product.aggregate([
                    { $match: { isActive: true } },
                    { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }
                ])
            }
        })
    } catch (error) {
        logger.error('Get products error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch products' })
    }
}

// @desc    Get single product with analytics
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('reviews')
            .populate('relatedProducts', 'name price images rating')

        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Track product view
        if (req.user) {
            const analytics = new Analytics({
                type: 'product_view',
                userId: req.user._id,
                productId: product._id,
                data: {
                    category: product.category,
                    price: product.price,
                    brand: product.brand
                }
            })
            await analytics.save()
        }

        // Increment view count
        product.viewCount = (product.viewCount || 0) + 1
        await product.save()

        // Real-time update to admin
        if (req.realTimeService) {
            req.realTimeService.io.to('admin').emit('product-view', {
                productId: product._id,
                name: product.name,
                viewCount: product.viewCount
            })
        }

        res.json(product)
    } catch (error) {
        logger.error('Get product by ID error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch product' })
    }
}

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.user._id
        }

        const product = new Product(productData)
        await product.save()

        // Real-time notification to admin
        if (req.realTimeService) {
            req.realTimeService.io.to('admin').emit('product-created', {
                product: {
                    id: product._id,
                    name: product.name,
                    category: product.category,
                    price: product.price
                }
            })
        }

        res.status(201).json(product)
    } catch (error) {
        logger.error('Create product error:', { error: error.message })
        res.status(400).json({ message: error.message })
    }
}

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const oldStock = product.stock
        Object.assign(product, req.body)
        product.updatedBy = req.user._id
        await product.save()

        // Check for stock changes
        if (oldStock !== product.stock && req.realTimeService) {
            if (product.stock <= 10) {
                req.realTimeService.io.to('admin').emit('low-stock-alert', {
                    product: {
                        id: product._id,
                        name: product.name,
                        stock: product.stock
                    }
                })
            }
        }

        res.json(product)
    } catch (error) {
        logger.error('Update product error:', { error: error.message })
        res.status(400).json({ message: error.message })
    }
}

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        product.isActive = false
        await product.save()

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        logger.error('Delete product error:', { error: error.message })
        res.status(500).json({ message: 'Failed to delete product' })
    }
}

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ viewCount: -1, salesCount: -1 })
            .limit(8)
            .populate('reviews', 'rating')

        res.json(products)
    } catch (error) {
        logger.error('Get trending products error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch trending products' })
    }
}

// @desc    Search products with autocomplete
// @route   GET /api/products/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query
        
        if (!q || q.length < 2) {
            return res.json([])
        }

        const suggestions = await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { brand: { $regex: q, $options: 'i' } },
                        { category: { $regex: q, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    brand: 1,
                    category: 1,
                    price: 1,
                    images: { $slice: ['$images', 1] }
                }
            },
            { $limit: 10 }
        ])

        res.json(suggestions)
    } catch (error) {
        logger.error('Get search suggestions error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch suggestions' })
    }
}