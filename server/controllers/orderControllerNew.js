import Order from '../models/Order.js'
import Tracking from '../models/Tracking.js'
import Notification from '../models/Notification.js'
import Product from '../models/Product.js'
import { Analytics } from '../models/Analytics.js'
import logger from '../utils/logger.js'

// @desc    Create new order with tracking
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

        // Validate stock availability
        for (const item of orderItems) {
            const product = await Product.findById(item.product)
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product?.name || 'product'}`
                })
            }
        }

        // Generate order number
        const orderCount = await Order.countDocuments()
        const orderNumber = `GW${Date.now().toString().slice(-8)}${(orderCount + 1).toString().padStart(3, '0')}`

        const order = new Order({
            user: req.user._id,
            orderNumber,
            orderItems,
            shippingAddress,
            paymentMethod,
            pricing,
            status: 'pending'
        })

        await order.save()

        // Create tracking record
        const tracking = new Tracking({
            orderId: order._id
        })
        tracking.generateTrackingNumber()
        tracking.timeline.push({
            status: 'order_placed',
            description: 'Order has been placed successfully',
            timestamp: new Date()
        })
        await tracking.save()

        // Update product stock and sales count
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: -item.quantity,
                    salesCount: item.quantity
                }
            })
        }

        // Track purchase analytics
        const analytics = new Analytics({
            type: 'purchase',
            userId: req.user._id,
            orderId: order._id,
            data: {
                revenue: pricing.total,
                itemCount: orderItems.length,
                paymentMethod,
                categories: [...new Set(orderItems.map(item => item.category))]
            }
        })
        await analytics.save()

        // Create notification
        const notification = new Notification({
            userId: req.user._id,
            type: 'order_update',
            title: 'Order Placed Successfully',
            message: `Your order #${orderNumber} has been placed and is being processed.`,
            data: { orderId: order._id }
        })
        await notification.save()

        // Real-time updates
        if (req.realTimeService) {
            // Notify admin
            req.realTimeService.io.to('admin').emit('new-order', {
                orderId: order._id,
                orderNumber,
                customerName: `${req.user.firstName} ${req.user.lastName}`,
                total: pricing.total,
                itemCount: orderItems.length
            })

            // Notify customer
            req.realTimeService.sendNotification(req.user._id, notification)
        }

        res.status(201).json({
            order,
            tracking: {
                trackingNumber: tracking.trackingNumber,
                status: tracking.status
            }
        })
    } catch (error) {
        logger.error('Create order error:', { error: error.message })
        res.status(500).json({ message: 'Failed to create order' })
    }
}

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query
        
        const query = { user: req.user._id }
        if (status) query.status = status

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const skip = (pageNum - 1) * limitNum

        const orders = await Order.find(query)
            .populate('orderItems.product', 'name images price')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)

        const totalOrders = await Order.countDocuments(query)

        // Get tracking info for each order
        const ordersWithTracking = await Promise.all(
            orders.map(async (order) => {
                const tracking = await Tracking.findOne({ orderId: order._id })
                return {
                    ...order.toObject(),
                    tracking: tracking ? {
                        trackingNumber: tracking.trackingNumber,
                        status: tracking.status,
                        estimatedDelivery: tracking.estimatedDelivery,
                        timeline: tracking.timeline
                    } : null
                }
            })
        )

        res.json({
            orders: ordersWithTracking,
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(totalOrders / limitNum),
                totalOrders
            }
        })
    } catch (error) {
        logger.error('Get my orders error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch orders' })
    }
}

// @desc    Get order by ID with tracking
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('orderItems.product', 'name images price brand')

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' })
        }

        const tracking = await Tracking.findOne({ orderId: order._id })

        res.json({
            order,
            tracking: tracking ? {
                trackingNumber: tracking.trackingNumber,
                status: tracking.status,
                estimatedDelivery: tracking.estimatedDelivery,
                actualDelivery: tracking.actualDelivery,
                timeline: tracking.timeline,
                carrier: tracking.carrier
            } : null
        })
    } catch (error) {
        logger.error('Get order by ID error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch order' })
    }
}

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, location, description, estimatedDelivery } = req.body
        
        const order = await Order.findById(req.params.id).populate('user')
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        order.status = status
        await order.save()

        const tracking = await Tracking.findOne({ orderId: order._id })
        if (tracking) {
            await tracking.updateStatus(status, location, description)
            
            if (estimatedDelivery) {
                tracking.estimatedDelivery = new Date(estimatedDelivery)
                await tracking.save()
            }
        }

        // Create notification
        const notification = new Notification({
            userId: order.user._id,
            type: 'order_update',
            title: 'Order Status Updated',
            message: `Your order #${order.orderNumber} is now ${status.replace('_', ' ')}`,
            data: { orderId: order._id, status }
        })
        await notification.save()

        // Real-time updates
        if (req.realTimeService) {
            await req.realTimeService.updateOrderStatus(
                order._id,
                status,
                location,
                description
            )
        }

        res.json({
            message: 'Order status updated successfully',
            order,
            tracking: tracking ? {
                status: tracking.status,
                timeline: tracking.timeline
            } : null
        })
    } catch (error) {
        logger.error('Update order status error:', { error: error.message })
        res.status(500).json({ message: 'Failed to update order status' })
    }
}

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query

        const query = {}
        
        if (status) query.status = status
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const skip = (pageNum - 1) * limitNum

        let orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .populate('orderItems.product', 'name images')
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .limit(limitNum)
            .skip(skip)

        if (search) {
            orders = orders.filter(order => 
                order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                order.user.email.toLowerCase().includes(search.toLowerCase())
            )
        }

        const totalOrders = await Order.countDocuments(query)

        res.json({
            orders,
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(totalOrders / limitNum),
                totalOrders
            }
        })
    } catch (error) {
        logger.error('Get all orders error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch orders' })
    }
}

// @desc    Track order by tracking number
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
export const trackOrder = async (req, res) => {
    try {
        const tracking = await Tracking.findOne({ 
            trackingNumber: req.params.trackingNumber 
        }).populate({
            path: 'orderId',
            populate: {
                path: 'orderItems.product',
                select: 'name images'
            }
        })

        if (!tracking) {
            return res.status(404).json({ message: 'Tracking number not found' })
        }

        res.json({
            trackingNumber: tracking.trackingNumber,
            status: tracking.status,
            estimatedDelivery: tracking.estimatedDelivery,
            actualDelivery: tracking.actualDelivery,
            timeline: tracking.timeline,
            order: {
                orderNumber: tracking.orderId.orderNumber,
                items: tracking.orderId.orderItems.length,
                total: tracking.orderId.pricing.total
            }
        })
    } catch (error) {
        logger.error('Track order error:', { error: error.message })
        res.status(500).json({ message: 'Failed to track order' })
    }
}