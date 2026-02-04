import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import axios from '../../utils/axios';

const initialState = {
    dashboard: {
        totalProducts: 0,
        totalCustomers: 0,
        ordersByStatus: {},
    },
    customers: [],
    impersonating: false,
    impersonatedUser: null,
    loading: false,
    error: null,
}

// Fetch dashboard metrics
export const fetchDashboard = createAsyncThunk(
    'admin/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            return await apiService.getDashboardStats()
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch dashboard')
        }
    }
)

// Fetch customers
export const fetchCustomers = createAsyncThunk(
    'admin/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            return await apiService.getCustomers()
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch customers')
        }
    }
)

// Block/Unblock customer
export const toggleBlockCustomer = createAsyncThunk(
    'admin/toggleBlockCustomer',
    async (customerId, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/admin/customers/${customerId}/block`)
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update customer')
        }
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setImpersonating: (state, action) => {
            state.impersonating = action.payload.impersonating
            state.impersonatedUser = action.payload.user
        },
        exitImpersonation: (state) => {
            state.impersonating = false
            state.impersonatedUser = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch dashboard
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false
                state.dashboard = action.payload
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch customers
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false
                state.customers = action.payload
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setImpersonating, exitImpersonation } = adminSlice.actions
export default adminSlice.reducer
