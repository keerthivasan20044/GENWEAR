import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['order_update', 'promotion', 'system', 'reminder', 'welcome'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        url: String,
        action: String
    },
    channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
    },
    readAt: Date,
    sentAt: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, {
    timestamps: true
})

notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ status: 1, createdAt: -1 })

notificationSchema.methods.markAsRead = function() {
    this.readAt = new Date()
    return this.save()
}

notificationSchema.methods.markAsSent = function() {
    this.status = 'sent'
    this.sentAt = new Date()
    return this.save()
}

export default mongoose.model('Notification', notificationSchema)