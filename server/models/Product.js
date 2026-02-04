import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Original price cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0
        },
        stock: {
            type: Number,
            required: [true, 'Total stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        images: {
            thumbnail: String,
            main: String,
            gallery: [{
                url: String,
                alt: String,
                type: { type: String, enum: ['front', 'back', 'side', 'detail', 'model'] }
            }]
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['topwear', 'bottomwear', 'outerwear', 'accessories', 'footwear'],
            lowercase: true,
        },
        gender: {
            type: String,
            required: [true, 'Gender target is required'],
            enum: ['men', 'women', 'kids', 'unisex'],
            lowercase: true,
        },
        colors: [{
            name: String,
            hex: String
        }],
        sizes: [{
            size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', 'One Size', '4Y', '6Y', '8Y', '10Y', '12Y', '30', '32', '34', '36', '26', '28'] },
            stock: Number
        }],
        material: {
            type: String,
            enum: ['cotton', 'wool', 'denim', 'polyester', 'silk', 'linen', 'viscose', 'fleece', 'blend', 'leather'],
            lowercase: true,
        },
        fit: {
            type: String,
            enum: ['slim', 'regular', 'relaxed', 'oversized', 'tailored', 'athletic'],
            lowercase: true,
        },
        brand: {
            type: String,
            default: 'GENWEAR',
        },
        features: [String],
        careInstructions: [String],
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        tags: [String],
    },
    {
        timestamps: true,
        suppressReservedKeysWarning: true
    }
)

// Indexes for faster queries
productSchema.index({ name: 'text', description: 'text', brand: 'text' })
productSchema.index({ price: 1 })
productSchema.index({ category: 1 })
productSchema.index({ gender: 1 })
productSchema.index({ isActive: 1 })
productSchema.index({ isNewArrival: 1 })
// slug already has unique:true, no need for separate index

const Product = mongoose.model('Product', productSchema)

export default Product
