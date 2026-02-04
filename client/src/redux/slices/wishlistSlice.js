import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [], // Array of product IDs
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
        },

        removeFromWishlist: (state, action) => {
            const productId = action.payload
            state.items = state.items.filter(id => id !== productId)
        },

        toggleWishlist: (state, action) => {
            const productId = action.payload
            if (state.items.includes(productId)) {
                state.items = state.items.filter(id => id !== productId)
            } else {
                state.items.push(productId)
            }
        },

        clearWishlist: (state) => {
            state.items = []
        },
    },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
