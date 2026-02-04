/**
 * Environment Variable Validation Utility
 * Validates required environment variables on server startup
 */

const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'PORT'
]

const optionalEnvVars = [
    'NODE_ENV',
    'CLIENT_URL',
    'CLOUDINARY_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS'
]

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export const validateEnv = () => {
    const missing = []
    const warnings = []

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar)
        }
    }

    // Check JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        warnings.push('JWT_SECRET should be at least 32 characters for better security')
    }

    // Check NODE_ENV
    if (!process.env.NODE_ENV) {
        warnings.push('NODE_ENV not set, defaulting to "development"')
        process.env.NODE_ENV = 'development'
    }

    // Check MONGO_URI format
    if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
        missing.push('MONGO_URI must start with "mongodb://" or "mongodb+srv://"')
    }

    // Report missing variables
    if (missing.length > 0) {
        console.error('\n❌ ERROR: Missing required environment variables:')
        missing.forEach(v => console.error(`   - ${v}`))
        console.error('\nPlease create a .env file in the server directory.')
        console.error('See .env.example for reference.\n')
        throw new Error('Missing required environment variables')
    }

    // Report warnings
    if (warnings.length > 0) {
        console.warn('\n⚠️  WARNING: Environment configuration issues:')
        warnings.forEach(w => console.warn(`   - ${w}`))
        console.warn('')
    }

    // Report optional missing variables
    const missingOptional = optionalEnvVars.filter(v => !process.env[v])
    if (missingOptional.length > 0) {
        console.log('\nℹ️  Optional environment variables not set:')
        missingOptional.forEach(v => console.log(`   - ${v}`))
        console.log('')
    }

    console.log('✅ Environment variables validated successfully\n')
}

/**
 * Gets environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not set
 * @returns {*} Environment variable value or default
 */
export const getEnv = (key, defaultValue = undefined) => {
    return process.env[key] || defaultValue
}

/**
 * Gets environment variable as number
 * @param {string} key - Environment variable key
 * @param {number} defaultValue - Default value if not set
 * @returns {number} Environment variable as number
 */
export const getEnvNumber = (key, defaultValue = 0) => {
    const value = process.env[key]
    return value ? parseInt(value, 10) : defaultValue
}

/**
 * Gets environment variable as boolean
 * @param {string} key - Environment variable key
 * @param {boolean} defaultValue - Default value if not set
 * @returns {boolean} Environment variable as boolean
 */
export const getEnvBoolean = (key, defaultValue = false) => {
    const value = process.env[key]
    if (!value) return defaultValue
    return value.toLowerCase() === 'true' || value === '1'
}

export default validateEnv
