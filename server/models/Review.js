import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index to ensure one review per customer per product
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true })

const Review = mongoose.model('Review', reviewSchema)

export default Review
