import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
