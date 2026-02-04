class PerformanceMonitor {
    constructor() {
        this.metrics = {}
        this.observers = []
        this.init()
    }

    init() {
        if (typeof window !== 'undefined') {
            this.observeWebVitals()
            this.observeNavigation()
            this.observeResources()
        }
    }

    observeWebVitals() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                const lastEntry = entries[entries.length - 1]
                this.metrics.lcp = lastEntry.startTime
                this.reportMetric('LCP', lastEntry.startTime)
            })
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                entries.forEach((entry) => {
                    this.metrics.fid = entry.processingStart - entry.startTime
                    this.reportMetric('FID', entry.processingStart - entry.startTime)
                })
            })
            fidObserver.observe({ entryTypes: ['first-input'] })

            // Cumulative Layout Shift
            let clsValue = 0
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value
                        this.metrics.cls = clsValue
                        this.reportMetric('CLS', clsValue)
                    }
                })
            })
            clsObserver.observe({ entryTypes: ['layout-shift'] })
        }
    }

    observeNavigation() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navEntries = performance.getEntriesByType('navigation')
            if (navEntries.length > 0) {
                const nav = navEntries[0]
                this.metrics.ttfb = nav.responseStart - nav.requestStart
                this.metrics.domLoad = nav.domContentLoadedEventEnd - nav.navigationStart
                this.metrics.windowLoad = nav.loadEventEnd - nav.navigationStart
                
                this.reportMetric('TTFB', this.metrics.ttfb)
                this.reportMetric('DOM Load', this.metrics.domLoad)
                this.reportMetric('Window Load', this.metrics.windowLoad)
            }
        }
    }

    observeResources() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                entries.forEach((entry) => {
                    if (entry.duration > 1000) { // Resources taking > 1s
                        this.reportSlowResource(entry.name, entry.duration)
                    }
                })
            })
            resourceObserver.observe({ entryTypes: ['resource'] })
        }
    }

    reportMetric(name, value) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`Performance Metric - ${name}: ${Math.round(value)}ms`)
        }
        
        // Send to analytics in production
        if (process.env.NODE_ENV === 'production' && window.gtag) {
            window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value)
            })
        }
    }

    reportSlowResource(url, duration) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Slow Resource: ${url} took ${Math.round(duration)}ms`)
        }
    }

    getMetrics() {
        return this.metrics
    }

    // Track custom metrics
    startTiming(label) {
        if ('performance' in window) {
            performance.mark(`${label}-start`)
        }
    }

    endTiming(label) {
        if ('performance' in window) {
            performance.mark(`${label}-end`)
            performance.measure(label, `${label}-start`, `${label}-end`)
            
            const measures = performance.getEntriesByName(label, 'measure')
            if (measures.length > 0) {
                const duration = measures[measures.length - 1].duration
                this.reportMetric(label, duration)
                return duration
            }
        }
        return 0
    }

    // Memory usage
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            }
        }
        return null
    }

    // Connection info
    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            }
        }
        return null
    }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

export default performanceMonitor

// React hook for performance monitoring
export const usePerformance = () => {
    const startTiming = (label) => performanceMonitor.startTiming(label)
    const endTiming = (label) => performanceMonitor.endTiming(label)
    const getMetrics = () => performanceMonitor.getMetrics()
    const getMemoryUsage = () => performanceMonitor.getMemoryUsage()
    const getConnectionInfo = () => performanceMonitor.getConnectionInfo()

    return {
        startTiming,
        endTiming,
        getMetrics,
        getMemoryUsage,
        getConnectionInfo
    }
}