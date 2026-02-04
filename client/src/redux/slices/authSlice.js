import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const data = await authAPI.login(credentials);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const data = await authAPI.register(userData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: userInfoFromStorage?.user || null,
        token: userInfoFromStorage?.token || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('userInfo');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
