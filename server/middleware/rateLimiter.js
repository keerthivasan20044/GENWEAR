// Rate limiting middleware to prevent abuse
const requestCounts = new Map()

export const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        message = 'Too many requests, please try again later.'
    } = options

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress
        const now = Date.now()

        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, [])
        }

        const requests = requestCounts.get(ip)
        const recentRequests = requests.filter(time => now - time < windowMs)

        if (recentRequests.length >= max) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil(windowMs / 1000)
            })
        }

        recentRequests.push(now)
        requestCounts.set(ip, recentRequests)

        // Clean up old entries periodically
        if (Math.random() < 0.01) { // 1% chance
            for (const [key, times] of requestCounts.entries()) {
                const validTimes = times.filter(time => now - time < windowMs)
                if (validTimes.length === 0) {
                    requestCounts.delete(key)
                } else {
                    requestCounts.set(key, validTimes)
                }
            }
        }

        next()
    }
}

// Specific rate limiters
export const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes for auth routes
    message: 'Too many authentication attempts, please try again later.'
})

export const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
})
