// Mock API service for Vercel deployment (no backend)
const MOCK_USERS = [
  {
    _id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@genwear.com',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    _id: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
]

const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    category: 'topwear',
    gender: 'men',
    brand: 'GENWEAR',
    stock: 50,
    isActive: true,
    rating: 4.5,
    description: 'High-quality cotton t-shirt perfect for everyday wear.'
  },
  {
    _id: '2',
    name: 'Denim Jacket',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'],
    category: 'outerwear',
    gender: 'unisex',
    brand: 'GENWEAR',
    stock: 25,
    isActive: true,
    rating: 4.8,
    description: 'Classic denim jacket with modern fit.'
  }
]

class MockAPI {
  constructor() {
    this.baseURL = window.location.origin
    this.token = localStorage.getItem('token')
  }

  // Simulate network delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Auth endpoints
  async login(credentials) {
    await this.delay()
    
    const user = MOCK_USERS.find(u => 
      u.email === credentials.email && u.password === credentials.password
    )
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const token = 'mock_jwt_token_' + Date.now()
    const userData = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    }
    
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userData))
    
    return userData
  }

  async register(userData) {
    await this.delay()
    
    const existingUser = MOCK_USERS.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      role: 'user'
    }
    
    MOCK_USERS.push(newUser)
    
    const token = 'mock_jwt_token_' + Date.now()
    const responseData = {
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      },
      token
    }
    
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(responseData))
    
    return responseData
  }

  // Products endpoints
  async getProducts(params = {}) {
    await this.delay()
    
    let filteredProducts = [...MOCK_PRODUCTS]
    
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category)
    }
    
    if (params.gender) {
      filteredProducts = filteredProducts.filter(p => p.gender === params.gender || p.gender === 'unisex')
    }
    
    if (params.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(params.search.toLowerCase())
      )
    }
    
    return {
      products: filteredProducts,
      pagination: {
        page: 1,
        totalPages: 1,
        totalProducts: filteredProducts.length
      }
    }
  }

  async getProductById(id) {
    await this.delay()
    
    const product = MOCK_PRODUCTS.find(p => p._id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return product
  }

  // Cart endpoints
  async getCart() {
    await this.delay()
    
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0}')
    return cart
  }

  async addToCart(data) {
    await this.delay()
    
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0}')
    const existingItem = cart.items.find(item => 
      item.product === data.productId && 
      item.size === data.size && 
      item.color === data.color
    )
    
    if (existingItem) {
      existingItem.quantity += data.quantity
    } else {
      const product = MOCK_PRODUCTS.find(p => p._id === data.productId)
      cart.items.push({
        _id: Date.now().toString(),
        product: data.productId,
        productDetails: product,
        quantity: data.quantity,
        size: data.size,
        color: data.color,
        price: product.price
      })
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    localStorage.setItem('cart', JSON.stringify(cart))
    
    return cart
  }

  // Orders endpoints
  async createOrder(orderData) {
    await this.delay()
    
    const order = {
      _id: Date.now().toString(),
      orderNumber: 'GW' + Date.now().toString().slice(-8),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify({items: [], total: 0}))
    
    return { order }
  }

  async getMyOrders() {
    await this.delay()
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    return { orders }
  }

  // Admin endpoints
  async getDashboard() {
    await this.delay()
    
    return {
      totalProducts: MOCK_PRODUCTS.length,
      totalCustomers: MOCK_USERS.filter(u => u.role === 'user').length,
      ordersByStatus: { pending: 5, processing: 3, shipped: 2, delivered: 10 }
    }
  }
}

// Create singleton instance
const mockAPI = new MockAPI()

// Export for use in API service
export default mockAPI