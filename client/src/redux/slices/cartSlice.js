import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isOpen: false,
        loading: false,
        error: null,
    },
    reducers: {
        setCartOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        addToCart: (state, action) => {
            const { product, quantity = 1, size, color } = action.payload;

            if (!product || (!product._id && !product.id)) return;

            // Robust default selection
            const finalSize = size || (product.sizes?.[0]?.size || product.sizes?.[0] || 'M');
            const finalColor = color || (typeof product.colors?.[0] === 'string' ? product.colors[0] : (product.colors?.[0]?.name || 'Default'));

            const existingItemIndex = state.items.findIndex(
                item => (item.product._id || item.product.id) === (product._id || product.id) &&
                    item.size === finalSize &&
                    item.color === finalColor
            );

            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].quantity += quantity;
            } else {
                state.items.push({
                    _id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    product,
                    quantity,
                    size: finalSize,
                    color: finalColor,
                    price: product.price
                });
            }

            state.totalItems = state.items.reduce((acc, item) => acc + Number(item.quantity), 0);
            state.totalPrice = state.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity)), 0);
            state.isOpen = true; // Automatically open the drawer
        },

        updateCartItem: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i._id === id);
            if (item) {
                item.quantity = Number(quantity);
                if (item.quantity <= 0) {
                    state.items = state.items.filter(i => i._id !== id);
                }
            }
            state.totalItems = state.items.reduce((acc, item) => acc + Number(item.quantity), 0);
            state.totalPrice = state.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity)), 0);
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item._id !== id);
            state.totalItems = state.items.reduce((acc, item) => acc + Number(item.quantity), 0);
            state.totalPrice = state.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity)), 0);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        }
    }
});

export const {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
