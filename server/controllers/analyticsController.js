import { Analytics, SalesMetrics } from '../models/Analytics.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import logger from '../utils/logger.js'

// @desc    Track user action
// @route   POST /api/analytics/track
// @access  Public
export const trackAction = async (req, res) => {
    try {
        const { type, data } = req.body
        
        const analytics = new Analytics({
            type,
            userId: req.user?._id,
            sessionId: req.sessionID,
            data: {
                ...data,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                timestamp: new Date()
            }
        })

        await analytics.save()

        // Real-time update to admin
        if (req.realTimeService) {
            req.realTimeService.io.to('admin').emit('analytics-update', {
                type,
                data: analytics
            })
        }

        res.json({ success: true })
    } catch (error) {
        logger.error('Track action error:', { error: error.message })
        res.status(500).json({ message: 'Failed to track action' })
    }
}

// @desc    Get dashboard analytics (Admin)
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
    try {
        const { period = '7d' } = req.query
        
        let startDate = new Date()
        switch (period) {
            case '24h':
                startDate.setHours(startDate.getHours() - 24)
                break
            case '7d':
                startDate.setDate(startDate.getDate() - 7)
                break
            case '30d':
                startDate.setDate(startDate.getDate() - 30)
                break
            case '90d':
                startDate.setDate(startDate.getDate() - 90)
                break
        }

        // Sales metrics
        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    revenue: { $sum: '$pricing.total' },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: '$pricing.total' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ])

        // Product performance
        const topProducts = await Analytics.aggregate([
            { $match: { type: 'product_view', timestamp: { $gte: startDate } } },
            { $group: { _id: '$productId', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    name: '$product.name',
                    views: 1,
                    sales: '$product.salesCount',
                    revenue: { $multiply: ['$product.salesCount', '$product.price'] }
                }
            }
        ])

        // User behavior
        const userMetrics = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ])

        // Conversion funnel
        const funnelData = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    pageViews: {
                        $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] }
                    },
                    productViews: {
                        $sum: { $cond: [{ $eq: ['$type', 'product_view'] }, 1, 0] }
                    },
                    cartAdds: {
                        $sum: { $cond: [{ $eq: ['$type', 'cart_add'] }, 1, 0] }
                    },
                    purchases: {
                        $sum: { $cond: [{ $eq: ['$type', 'purchase'] }, 1, 0] }
                    }
                }
            }
        ])

        // Real-time metrics
        const realTimeMetrics = {
            activeUsers: req.realTimeService?.activeUsers.size || 0,
            todayOrders: await Order.countDocuments({
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
            }),
            todayRevenue: await Order.aggregate([
                { $match: { createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } }
            ]).then(result => result[0]?.total || 0)
        }

        res.json({
            salesData,
            topProducts,
            userMetrics,
            funnelData: funnelData[0] || {},
            realTimeMetrics,
            period
        })
    } catch (error) {
        logger.error('Get dashboard analytics error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch analytics' })
    }
}

// @desc    Get product analytics (Admin)
// @route   GET /api/analytics/products
// @access  Private/Admin
export const getProductAnalytics = async (req, res) => {
    try {
        const { productId, period = '30d' } = req.query
        
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - parseInt(period.replace('d', '')))

        const query = { timestamp: { $gte: startDate } }
        if (productId) query.productId = productId

        const analytics = await Analytics.aggregate([
            { $match: { type: 'product_view', ...query } },
            {
                $group: {
                    _id: {
                        productId: '$productId',
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$timestamp'
                            }
                        }
                    },
                    views: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    date: '$_id.date',
                    productName: '$product.name',
                    views: 1,
                    price: '$product.price',
                    stock: '$product.stock'
                }
            },
            { $sort: { date: 1 } }
        ])

        res.json(analytics)
    } catch (error) {
        logger.error('Get product analytics error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch product analytics' })
    }
}

// @desc    Get customer analytics (Admin)
// @route   GET /api/analytics/customers
// @access  Private/Admin
export const getCustomerAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query
        
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - parseInt(period.replace('d', '')))

        // Customer acquisition
        const newCustomers = await User.aggregate([
            { $match: { createdAt: { $gte: startDate }, role: 'user' } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // Customer lifetime value
        const customerLTV = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$pricing.total' },
                    orderCount: { $sum: 1 },
                    avgOrderValue: { $avg: '$pricing.total' }
                }
            },
            {
                $group: {
                    _id: null,
                    avgLTV: { $avg: '$totalSpent' },
                    avgOrderCount: { $avg: '$orderCount' },
                    avgOrderValue: { $avg: '$avgOrderValue' }
                }
            }
        ])

        // Customer segments
        const customerSegments = await Order.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$pricing.total' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $bucket: {
                    groupBy: '$totalSpent',
                    boundaries: [0, 100, 500, 1000, 5000, Infinity],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                        avgOrders: { $avg: '$orderCount' }
                    }
                }
            }
        ])

        res.json({
            newCustomers,
            customerLTV: customerLTV[0] || {},
            customerSegments
        })
    } catch (error) {
        logger.error('Get customer analytics error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch customer analytics' })
    }
}

// @desc    Generate sales report (Admin)
// @route   GET /api/analytics/sales-report
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.query
        
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        const salesReport = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: '$customer' },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    orderNumber: 1,
                    orderDate: '$createdAt',
                    customerName: {
                        $concat: ['$customer.firstName', ' ', '$customer.lastName']
                    },
                    customerEmail: '$customer.email',
                    productName: '$product.name',
                    category: '$product.category',
                    quantity: '$orderItems.quantity',
                    unitPrice: '$orderItems.price',
                    totalPrice: {
                        $multiply: ['$orderItems.quantity', '$orderItems.price']
                    },
                    status: 1
                }
            },
            { $sort: { orderDate: -1 } }
        ])

        if (format === 'csv') {
            // Convert to CSV format
            const csv = [
                'Order Number,Order Date,Customer Name,Customer Email,Product Name,Category,Quantity,Unit Price,Total Price,Status',
                ...salesReport.map(row => 
                    `${row.orderNumber},${row.orderDate},${row.customerName},${row.customerEmail},${row.productName},${row.category},${row.quantity},${row.unitPrice},${row.totalPrice},${row.status}`
                )
            ].join('\n')
            
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv')
            return res.send(csv)
        }

        res.json(salesReport)
    } catch (error) {
        logger.error('Get sales report error:', { error: error.message })
        res.status(500).json({ message: 'Failed to generate sales report' })
    }
}