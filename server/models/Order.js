import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
                size: String,
                color: String,
                image: String
            },
        ],
        shippingAddress: {
            addressLine: String,
            city: String,
            state: String,
            pincode: String,
            phone: String
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'Card', 'UPI']
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentDetails: {
            transactionId: String,
            paidAt: Date
        },
        pricing: {
            subtotal: Number,
            shipping: Number,
            tax: Number,
            discount: Number,
            total: Number
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        trackingNumber: String,
    },
    {
        timestamps: true,
    }
)

// Indexes for faster queries
orderSchema.index({ user: 1 })
orderSchema.index({ orderStatus: 1 })
// orderNumber already has unique:true, no need for separate index
orderSchema.index({ createdAt: -1 })

const Order = mongoose.model('Order', orderSchema)

export default Order
