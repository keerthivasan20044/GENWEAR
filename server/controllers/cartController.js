import Cart from '../models/Cart.js'
import logger from '../utils/logger.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images colors sizes brand')
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] })
        }
        res.json(cart)
    } catch (error) {
        logger.error('Get cart error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body
        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity, size, color }]
            })
        } else {
            // Check if item exists with same size/color
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId &&
                item.size === size &&
                item.color === color
            )

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity
            } else {
                cart.items.push({ product: productId, quantity, size, color })
            }
            await cart.save()
        }

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images colors sizes brand')
        res.json(updatedCart)
    } catch (error) {
        logger.error('Add to cart error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body
        const cart = await Cart.findOne({ user: req.user._id })

        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.id)
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity
            await cart.save()
            const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images colors sizes brand')
            res.json(updatedCart)
        } else {
            res.status(404).json({ message: 'Item not found in cart' })
        }
    } catch (error) {
        logger.error('Update cart error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.id)
        await cart.save()

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images colors sizes brand')
        res.json(updatedCart)
    } catch (error) {
        logger.error('Remove cart item error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Clear cart
// @route   POST /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if (cart) {
            cart.items = []
            await cart.save()
        }
        res.json({ message: 'Cart cleared' })
    } catch (error) {
        logger.error('Clear cart error:', { error: error.message })
        res.status(500).json({ message: 'Server error' })
    }
}
