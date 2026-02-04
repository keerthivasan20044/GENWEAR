const logger = {
    error: (message, data) => {
        console.error(`[ERROR] ${message}`, data || '')
    },
    info: (message, data) => {
        console.log(`[INFO] ${message}`, data || '')
    },
    warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data || '')
    }
}

export default logger