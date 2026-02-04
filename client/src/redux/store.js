import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slices
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import adminReducer from './slices/adminSlice';
import orderReducer from './slices/orderSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['cart', 'auth', 'wishlist'], // Persistent data
};

const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    admin: adminReducer,
    order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
