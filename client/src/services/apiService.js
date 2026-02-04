import { products, users } from '../data/mockData';
import axios from '../utils/axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
    // PRODUCTS
    async getProducts(filters = {}) {
        try {
            const { data } = await axios.get('/api/products', { params: filters });
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Falling back to mock product data.');
            await delay(500);
            let filtered = [...products];

            // Gender filter
            if (filters.gender) filtered = filtered.filter(p => p.gender === filters.gender);

            // Category filter
            if (filters.category?.length > 0) filtered = filtered.filter(p => filters.category.includes(p.category));

            // Colors filter
            if (filters.colors?.length > 0) filtered = filtered.filter(p => p.colors.some(c => filters.colors.includes(c)));

            // Sizes filter
            if (filters.sizes?.length > 0) filtered = filtered.filter(p => p.sizes.some(s => filters.sizes.includes(s)));

            // Materials filter (NEW)
            if (filters.materials?.length > 0) {
                filtered = filtered.filter(p =>
                    p.material && filters.materials.some(m =>
                        p.material.toLowerCase().includes(m.toLowerCase())
                    )
                );
            }

            // Fits filter (NEW)
            if (filters.fits?.length > 0) {
                filtered = filtered.filter(p =>
                    p.fit && filters.fits.some(f =>
                        p.fit.toLowerCase().includes(f.toLowerCase().replace(' fit', ''))
                    )
                );
            }

            // Brands filter (NEW)
            if (filters.brands?.length > 0) {
                filtered = filtered.filter(p =>
                    p.brand && filters.brands.includes(p.brand)
                );
            }

            // Price range filter (enhanced)
            if (filters.priceRange && Array.isArray(filters.priceRange)) {
                const [min, max] = filters.priceRange;
                filtered = filtered.filter(p => p.price >= min && p.price <= max);
            } else {
                if (filters.minPrice !== undefined) filtered = filtered.filter(p => p.price >= filters.minPrice);
                if (filters.maxPrice !== undefined) filtered = filtered.filter(p => p.price <= filters.maxPrice);
            }

            // Stock filter
            if (filters.inStock) filtered = filtered.filter(p => p.inStock);

            // Enhanced search
            if (filters.search) {
                const q = filters.search.toLowerCase();
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.material?.toLowerCase().includes(q)
                );
            }

            // Sorting
            if (filters.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
            else if (filters.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
            else if (filters.sort === 'newest') filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            else if (filters.sort === 'popular') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 12;
            const start = (page - 1) * limit;

            const transformedProducts = filtered.map(p => {
                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return {
                    ...p,
                    _id: p.id,
                    images: {
                        main: p.images[0],
                        thumbnail: p.images[0],
                        gallery: p.images.map(img => ({ url: img, alt: p.name, type: 'front' }))
                    },
                    rating: {
                        average: p.rating || 0,
                        count: p.reviews || 0
                    },
                    discount
                };
            });

            return {
                products: transformedProducts.slice(start, start + limit),
                total: transformedProducts.length,
                page,
                totalPages: Math.ceil(transformedProducts.length / limit)
            };
        }
    },

    async getProductById(id) {
        try {
            const { data } = await axios.get(`/api/products/${id}`);
            return data;
        } catch (error) {
            const product = products.find(p => p.id === parseInt(id));
            if (!product) return null;

            const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
            return {
                ...product,
                _id: product.id,
                images: {
                    main: product.images[0],
                    thumbnail: product.images[0],
                    gallery: product.images.map(img => ({ url: img, alt: product.name, type: 'front' }))
                },
                rating: {
                    average: product.rating || 0,
                    count: product.reviews || 0
                },
                discount
            };
        }
    },

    async searchProducts(query) {
        try {
            const { data } = await axios.get('/api/products/search', { params: { q: query } });
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Local search fallback.');
            if (!query) return [];
            const q = query.toLowerCase();
            return products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5);
        }
    },

    // AUTH
    async login({ email, password }) {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Local authentication fallback.');
            await delay(800);
            const user = users.find(u => u.email === email && u.password === password);
            if (user) return { ...user, token: 'mock-token-' + Date.now() };
            throw new Error('Invalid credentials - Offline fallback failed.');
        }
    },

    async register(userData) {
        try {
            const { data } = await axios.post('/api/auth/register', userData);
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Creating temporary session.');
            await delay(800);
            return { id: Date.now(), ...userData, token: 'mock-token-' + Date.now() };
        }
    },

    // ORDERS
    async createOrder(orderData) {
        try {
            const { data } = await axios.post('/api/orders', orderData);
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Saving order locally.');
            await delay(1000);
            return { id: `ORD-${Math.floor(Math.random() * 1000000)}`, ...orderData, status: 'confirmed' };
        }
    },

    // ADMIN
    async getDashboardStats() {
        try {
            const { data } = await axios.get('/api/admin/dashboard');
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Displaying mock dashboard data.');
            await delay(600);
            return {
                totalProducts: products.length,
                totalCustomers: users.length,
                ordersByStatus: {
                    'Pending': 12, 'Processing': 5, 'Shipped': 8, 'Delivered': 45, 'Cancelled': 2
                }
            };
        }
    },

    async getCustomers() {
        try {
            const { data } = await axios.get('/api/admin/customers');
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Accessing local customer data.');
            await delay(500);
            return users;
        }
    },

    async getOrders() {
        try {
            const { data } = await axios.get('/api/orders');
            return data;
        } catch (error) {
            console.warn('⚠️ Offline Mode: Retrieving local order history.');
            await delay(700);
            return [
                {
                    id: 'ORD-892341',
                    status: 'Processing',
                    totalAmount: 4599,
                    createdAt: new Date().toISOString(),
                    user: users[0],
                    items: [
                        { name: 'Oversized Silhouette', price: 2999, quantity: 1, image: products[0].images[0] },
                        { name: 'Technical Cargo', price: 1599, quantity: 1, image: products[1].images[0] }
                    ],
                    shippingAddress: { addressLine: '123 Cyber Blvd', city: 'Neo-Delhi', state: 'Delhi', pincode: '110001', phone: '+91 99999 88888' }
                }
            ];
        }
    }
};
