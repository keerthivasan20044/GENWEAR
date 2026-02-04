import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await productAPI.getProducts(params);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await productAPI.getProductById(id);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        product: null,
        total: 0,
        pages: 0,
        loading: false,
        productLoading: false,
        error: null,
    },
    reducers: {
        clearProduct: (state) => {
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
                state.total = action.payload.total;
                state.pages = action.payload.totalPages;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.productLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.productLoading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.productLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
