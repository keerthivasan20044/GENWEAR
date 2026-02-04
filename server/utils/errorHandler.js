// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

// Custom error class
export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.isOperational = true
        this.timestamp = new Date().toISOString()

        Error.captureStackTrace(this, this.constructor)
    }
}

// Validation error class
export class ValidationError extends AppError {
    constructor(message, errors = {}) {
        super(message, 400, 'VALIDATION_ERROR')
        this.errors = errors
    }
}

// Authentication error class
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR')
    }
}

// Authorization error class
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'FORBIDDEN')
    }
}

// Not found error class
export class NotFoundError extends AppError {
    constructor(resource = 'Resource', id = '') {
        const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`
        super(message, 404, 'NOT_FOUND')
    }
}

// Error response helper
export const sendError = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        statusCode,
        message,
        timestamp: new Date().toISOString()
    }

    if (errors) {
        response.errors = errors
    }

    return res.status(statusCode).json(response)
}

// Success response helper
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        statusCode,
        message,
        timestamp: new Date().toISOString()
    }

    if (data) {
        response.data = data
    }

    return res.status(statusCode).json(response)
}
