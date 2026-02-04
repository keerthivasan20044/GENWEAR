import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderAPI } from '../../services/api'

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
}

// Create order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            return await orderAPI.create(orderData)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

// Fetch customer orders
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            return await orderAPI.getMyOrders()
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrder = action.payload
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
