import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import logger from '../utils/logger.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            pricing
        } = req.body

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' })
        }

        // Generate unique order number
        const orderNumber = 'GEN-' + Date.now() + Math.floor(Math.random() * 1000)

        const order = new Order({
            user: req.user._id,
            orderNumber,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            pricing
        })

        // Update stock with validation
        for (const item of orderItems) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                })
            }
            product.stock -= item.quantity
            await product.save()
        }

        const createdOrder = await order.save()

        // Clear user's cart after successful order
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })

        res.status(201).json(createdOrder)
    } catch (error) {
        logger.error('Create order error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        logger.error('Get my orders error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email')

        if (order) {
            // Check if user is owner or admin
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' })
            }
            res.json(order)
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        logger.error('Get order by ID error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'id firstName lastName')
        res.json(orders)
    } catch (error) {
        logger.error('Get all orders error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus
            if (req.body.status === 'delivered') {
                order.paymentStatus = 'completed'
                order.paymentDetails.paidAt = Date.now()
            }
            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        logger.error('Update order status error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}
