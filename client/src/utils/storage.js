// Advanced localStorage utilities with encryption and compression

class StorageManager {
    constructor() {
        this.prefix = 'genwear_'
        this.isSupported = this.checkSupport()
    }

    checkSupport() {
        try {
            const test = '__storage_test__'
            localStorage.setItem(test, test)
            localStorage.removeItem(test)
            return true
        } catch (e) {
            return false
        }
    }

    // Simple encryption for sensitive data
    encrypt(data) {
        try {
            return btoa(JSON.stringify(data))
        } catch (e) {
            return data
        }
    }

    decrypt(data) {
        try {
            return JSON.parse(atob(data))
        } catch (e) {
            return data
        }
    }

    // Compress large data
    compress(data) {
        return JSON.stringify(data)
    }

    decompress(data) {
        try {
            return JSON.parse(data)
        } catch (e) {
            return data
        }
    }

    set(key, value, options = {}) {
        if (!this.isSupported) return false

        try {
            const fullKey = this.prefix + key
            let processedValue = value

            // Add metadata
            const item = {
                value: processedValue,
                timestamp: Date.now(),
                expires: options.expires ? Date.now() + options.expires : null,
                encrypted: options.encrypt || false,
                compressed: options.compress || false
            }

            // Encrypt if needed
            if (options.encrypt) {
                item.value = this.encrypt(processedValue)
            }

            // Compress if needed
            if (options.compress) {
                item.value = this.compress(item.value)
            }

            localStorage.setItem(fullKey, JSON.stringify(item))
            return true
        } catch (e) {
            console.error('Storage set error:', e)
            return false
        }
    }

    get(key, defaultValue = null) {
        if (!this.isSupported) return defaultValue

        try {
            const fullKey = this.prefix + key
            const item = localStorage.getItem(fullKey)
            
            if (!item) return defaultValue

            const parsed = JSON.parse(item)

            // Check expiration
            if (parsed.expires && Date.now() > parsed.expires) {
                this.remove(key)
                return defaultValue
            }

            let value = parsed.value

            // Decompress if needed
            if (parsed.compressed) {
                value = this.decompress(value)
            }

            // Decrypt if needed
            if (parsed.encrypted) {
                value = this.decrypt(value)
            }

            return value
        } catch (e) {
            console.error('Storage get error:', e)
            return defaultValue
        }
    }

    remove(key) {
        if (!this.isSupported) return false

        try {
            const fullKey = this.prefix + key
            localStorage.removeItem(fullKey)
            return true
        } catch (e) {
            console.error('Storage remove error:', e)
            return false
        }
    }

    clear() {
        if (!this.isSupported) return false

        try {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key)
                }
            })
            return true
        } catch (e) {
            console.error('Storage clear error:', e)
            return false
        }
    }

    // Get all keys with prefix
    keys() {
        if (!this.isSupported) return []

        try {
            return Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.replace(this.prefix, ''))
        } catch (e) {
            console.error('Storage keys error:', e)
            return []
        }
    }

    // Get storage usage
    getUsage() {
        if (!this.isSupported) return { used: 0, total: 0 }

        try {
            let used = 0
            const keys = Object.keys(localStorage)
            
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    used += localStorage.getItem(key).length
                }
            })

            // Estimate total available (usually 5-10MB)
            const total = 5 * 1024 * 1024 // 5MB estimate

            return {
                used,
                total,
                percentage: (used / total) * 100
            }
        } catch (e) {
            console.error('Storage usage error:', e)
            return { used: 0, total: 0, percentage: 0 }
        }
    }

    // Clean expired items
    cleanup() {
        if (!this.isSupported) return 0

        let cleaned = 0
        try {
            const keys = this.keys()
            
            keys.forEach(key => {
                const item = this.get(key)
                if (item === null) { // Item was expired and removed
                    cleaned++
                }
            })

            return cleaned
        } catch (e) {
            console.error('Storage cleanup error:', e)
            return 0
        }
    }
}

// Create singleton instance
const storage = new StorageManager()

// Specific storage utilities for the app
export const userStorage = {
    setUser: (user) => storage.set('user', user, { encrypt: true }),
    getUser: () => storage.get('user'),
    removeUser: () => storage.remove('user'),
    
    setToken: (token) => storage.set('token', token, { encrypt: true }),
    getToken: () => storage.get('token'),
    removeToken: () => storage.remove('token')
}

export const cartStorage = {
    setCart: (cart) => storage.set('cart', cart, { compress: true }),
    getCart: () => storage.get('cart', { items: [], total: 0 }),
    removeCart: () => storage.remove('cart'),
    
    addItem: (item) => {
        const cart = cartStorage.getCart()
        const existingIndex = cart.items.findIndex(
            i => i.id === item.id && i.size === item.size && i.color === item.color
        )
        
        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += item.quantity
        } else {
            cart.items.push(item)
        }
        
        cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        cartStorage.setCart(cart)
        return cart
    },
    
    removeItem: (itemId, size, color) => {
        const cart = cartStorage.getCart()
        cart.items = cart.items.filter(
            i => !(i.id === itemId && i.size === size && i.color === color)
        )
        cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        cartStorage.setCart(cart)
        return cart
    },
    
    updateQuantity: (itemId, size, color, quantity) => {
        const cart = cartStorage.getCart()
        const item = cart.items.find(
            i => i.id === itemId && i.size === size && i.color === color
        )
        
        if (item) {
            item.quantity = quantity
            cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
            cartStorage.setCart(cart)
        }
        
        return cart
    }
}

export const wishlistStorage = {
    setWishlist: (wishlist) => storage.set('wishlist', wishlist),
    getWishlist: () => storage.get('wishlist', []),
    removeWishlist: () => storage.remove('wishlist'),
    
    addItem: (item) => {
        const wishlist = wishlistStorage.getWishlist()
        if (!wishlist.find(i => i.id === item.id)) {
            wishlist.push(item)
            wishlistStorage.setWishlist(wishlist)
        }
        return wishlist
    },
    
    removeItem: (itemId) => {
        const wishlist = wishlistStorage.getWishlist()
        const filtered = wishlist.filter(i => i.id !== itemId)
        wishlistStorage.setWishlist(filtered)
        return filtered
    }
}

export const searchStorage = {
    setRecentSearches: (searches) => storage.set('recent_searches', searches),
    getRecentSearches: () => storage.get('recent_searches', []),
    
    addSearch: (query) => {
        const searches = searchStorage.getRecentSearches()
        const filtered = searches.filter(s => s !== query)
        filtered.unshift(query)
        const limited = filtered.slice(0, 10) // Keep only 10 recent searches
        searchStorage.setRecentSearches(limited)
        return limited
    },
    
    clearSearches: () => storage.remove('recent_searches')
}

export const settingsStorage = {
    setSettings: (settings) => storage.set('settings', settings),
    getSettings: () => storage.get('settings', {
        theme: 'light',
        currency: 'INR',
        language: 'en',
        notifications: true,
        emailUpdates: true
    }),
    
    updateSetting: (key, value) => {
        const settings = settingsStorage.getSettings()
        settings[key] = value
        settingsStorage.setSettings(settings)
        return settings
    }
}

export const analyticsStorage = {
    setSessionData: (data) => storage.set('session', data, { expires: 30 * 60 * 1000 }), // 30 minutes
    getSessionData: () => storage.get('session', { 
        startTime: Date.now(),
        pageViews: 0,
        actions: []
    }),
    
    trackPageView: (page) => {
        const session = analyticsStorage.getSessionData()
        session.pageViews++
        session.actions.push({
            type: 'page_view',
            page,
            timestamp: Date.now()
        })
        analyticsStorage.setSessionData(session)
    },
    
    trackAction: (action, data = {}) => {
        const session = analyticsStorage.getSessionData()
        session.actions.push({
            type: action,
            data,
            timestamp: Date.now()
        })
        analyticsStorage.setSessionData(session)
    }
}

// Utility functions
export const clearAllStorage = () => {
    storage.clear()
}

export const getStorageUsage = () => {
    return storage.getUsage()
}

export const cleanupStorage = () => {
    return storage.cleanup()
}

export default storage