import mongoose from 'mongoose'

const trackingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['order_placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'order_placed'
    },
    location: {
        city: String,
        state: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    carrier: {
        name: String,
        contact: String,
        trackingUrl: String
    },
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: String,
        description: String,
        updatedBy: String
    }],
    notifications: [{
        type: { type: String, enum: ['sms', 'email', 'push'] },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        content: String
    }]
}, {
    timestamps: true
})

trackingSchema.methods.updateStatus = function(newStatus, location, description) {
    this.status = newStatus
    this.timeline.push({
        status: newStatus,
        location,
        description,
        timestamp: new Date()
    })
    
    if (newStatus === 'delivered') {
        this.actualDelivery = new Date()
    }
    
    return this.save()
}

trackingSchema.methods.generateTrackingNumber = function() {
    const prefix = 'GW'
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    this.trackingNumber = `${prefix}${timestamp}${random}`
    return this.trackingNumber
}

export default mongoose.model('Tracking', trackingSchema)