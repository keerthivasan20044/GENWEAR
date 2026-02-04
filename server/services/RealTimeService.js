import { Analytics } from '../models/Analytics.js'
import Notification from '../models/Notification.js'
import Tracking from '../models/Tracking.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

class RealTimeService {
    constructor(io) {
        this.io = io
        this.activeUsers = new Map()
        this.adminSockets = new Set()
    }

    handleConnection(socket) {
        console.log(`User connected: ${socket.id}`)
        
        socket.on('user-online', (userId) => {
            this.activeUsers.set(socket.id, userId)
            this.broadcastUserCount()
        })

        socket.on('join-admin', () => {
            this.adminSockets.add(socket.id)
            socket.join('admin')
        })

        socket.on('track-page', (data) => {
            this.trackPageView(data, socket)
        })

        socket.on('track-product-view', (data) => {
            this.trackProductView(data, socket)
        })

        socket.on('disconnect', () => {
            this.activeUsers.delete(socket.id)
            this.adminSockets.delete(socket.id)
            this.broadcastUserCount()
        })
    }

    async trackPageView(data, socket) {
        try {
            const analytics = new Analytics({
                type: 'page_view',
                userId: data.userId,
                sessionId: socket.id,
                data: {
                    page: data.page,
                    referrer: data.referrer,
                    userAgent: data.userAgent,
                    duration: data.duration
                }
            })
            await analytics.save()
            
            this.io.to('admin').emit('analytics-update', {
                type: 'page_view',
                data: analytics
            })
        } catch (error) {
            console.error('Track page view error:', error)
        }
    }

    async trackProductView(data, socket) {
        try {
            const analytics = new Analytics({
                type: 'product_view',
                userId: data.userId,
                sessionId: socket.id,
                productId: data.productId,
                data: {
                    category: data.category,
                    price: data.price
                }
            })
            await analytics.save()

            await Product.findByIdAndUpdate(data.productId, {
                $inc: { viewCount: 1 }
            })

            this.io.to('admin').emit('product-view', {
                productId: data.productId,
                viewCount: await this.getProductViewCount(data.productId)
            })
        } catch (error) {
            console.error('Track product view error:', error)
        }
    }

    async updateOrderStatus(orderId, status, location, description) {
        try {
            const order = await Order.findById(orderId).populate('user')
            if (!order) return

            const tracking = await Tracking.findOne({ orderId })
            if (tracking) {
                await tracking.updateStatus(status, location, description)
                
                const notification = new Notification({
                    userId: order.user._id,
                    type: 'order_update',
                    title: 'Order Status Update',
                    message: `Your order #${order.orderNumber} is now ${status.replace('_', ' ')}`,
                    data: { orderId, status }
                })
                await notification.save()

                this.io.emit(`order-update-${order.user._id}`, {
                    orderId,
                    status,
                    tracking: tracking.timeline
                })

                this.io.to('admin').emit('order-status-changed', {
                    orderId,
                    status,
                    customerName: `${order.user.firstName} ${order.user.lastName}`
                })
            }
        } catch (error) {
            console.error('Update order status error:', error)
        }
    }

    async checkLowStock() {
        try {
            const lowStockProducts = await Product.find({
                stock: { $lte: 10 },
                isActive: true
            })

            if (lowStockProducts.length > 0) {
                this.io.to('admin').emit('low-stock-alert', {
                    products: lowStockProducts.map(p => ({
                        id: p._id,
                        name: p.name,
                        stock: p.stock,
                        sku: p.sku
                    }))
                })
            }
        } catch (error) {
            console.error('Check low stock error:', error)
        }
    }

    async syncCart(userId, cartData) {
        this.io.emit(`cart-sync-${userId}`, cartData)
    }

    broadcastUserCount() {
        const count = this.activeUsers.size
        this.io.emit('active-users', { count })
        this.io.to('admin').emit('active-users-admin', { 
            count,
            users: Array.from(this.activeUsers.values())
        })
    }

    async sendNotification(userId, notification) {
        this.io.emit(`notification-${userId}`, notification)
    }

    async broadcastDashboardMetrics() {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const todayOrders = await Order.countDocuments({
                createdAt: { $gte: today }
            })

            const todayRevenue = await Order.aggregate([
                { $match: { createdAt: { $gte: today } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } }
            ])

            const metrics = {
                todayOrders,
                todayRevenue: todayRevenue[0]?.total || 0,
                activeUsers: this.activeUsers.size,
                timestamp: new Date()
            }

            this.io.to('admin').emit('dashboard-metrics', metrics)
        } catch (error) {
            console.error('Broadcast dashboard metrics error:', error)
        }
    }

    async getProductViewCount(productId) {
        const count = await Analytics.countDocuments({
            type: 'product_view',
            productId
        })
        return count
    }
}

export default RealTimeService