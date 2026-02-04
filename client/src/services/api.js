import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

        // Handle token expiration
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('userInfo');
            // Optional: window.location.href = '/login';
        }

        return Promise.reject(message);
    }
);

export default api;

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/me'),
};

export const productAPI = {
    getProducts: (params) => api.get('/products', { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    search: (q) => api.get('/products/search', { params: { q } }),
};

export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (data) => api.post('/cart', data),
    updateItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/${itemId}`),
    clear: () => api.post('/cart/clear'),
};

export const orderAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getMyOrders: () => api.get('/orders/myorders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
};
