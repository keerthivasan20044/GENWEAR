import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['page_view', 'product_view', 'cart_add', 'cart_remove', 'purchase', 'search', 'user_action'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sessionId: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    data: {
        page: String,
        referrer: String,
        userAgent: String,
        ip: String,
        country: String,
        city: String,
        device: String,
        browser: String,
        searchTerm: String,
        category: String,
        price: Number,
        quantity: Number,
        revenue: Number,
        duration: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

analyticsSchema.index({ type: 1, timestamp: -1 })
analyticsSchema.index({ userId: 1, timestamp: -1 })
analyticsSchema.index({ productId: 1, timestamp: -1 })

const salesMetricsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    metrics: {
        totalRevenue: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        totalCustomers: { type: Number, default: 0 },
        averageOrderValue: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
        topProducts: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            sales: Number,
            revenue: Number
        }],
        topCategories: [{
            category: String,
            sales: Number,
            revenue: Number
        }],
        trafficSources: [{
            source: String,
            visits: Number,
            conversions: Number
        }]
    }
}, {
    timestamps: true
})

export const Analytics = mongoose.model('Analytics', analyticsSchema)
export const SalesMetrics = mongoose.model('SalesMetrics', salesMetricsSchema)