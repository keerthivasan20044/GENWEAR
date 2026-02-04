import { createSlice } from '@reduxjs/toolkit'

const wishlistFromStorage = localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [];

const initialState = {
    items: wishlistFromStorage, // Array of product IDs
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const productId = action.payload
            if (!state.items.includes(productId)) {
                state.items.push(productId)
            }
            localStorage.setItem('wishlistItems', JSON.stringify(state.items));
        },

        removeFromWishlist: (state, action) => {
            const productId = action.payload
            state.items = state.items.filter(id => id !== productId)
            localStorage.setItem('wishlistItems', JSON.stringify(state.items));
        },

        toggleWishlist: (state, action) => {
            const productId = action.payload
            if (state.items.includes(productId)) {
                state.items = state.items.filter(id => id !== productId)
            } else {
                state.items.push(productId)
            }
            localStorage.setItem('wishlistItems', JSON.stringify(state.items));
        },

        clearWishlist: (state) => {
            state.items = []
            localStorage.removeItem('wishlistItems');
        },
    },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
