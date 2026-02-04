// Image optimization utilities
export const imageOptimizer = {
    // Generate responsive image URLs
    getResponsiveUrl: (url, width, quality = 80) => {
        if (!url) return ''
        
        // Cloudinary transformations
        if (url.includes('cloudinary.com')) {
            const parts = url.split('/upload/')
            if (parts.length === 2) {
                return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`
            }
        }
        
        // Unsplash transformations
        if (url.includes('unsplash.com')) {
            return `${url}?w=${width}&q=${quality}&auto=format`
        }
        
        return url
    },

    // Generate srcSet for responsive images
    generateSrcSet: (url, sizes = [400, 800, 1200, 1600]) => {
        return sizes.map(size => 
            `${imageOptimizer.getResponsiveUrl(url, size)} ${size}w`
        ).join(', ')
    },

    // Lazy load image with intersection observer
    lazyLoad: (img, src, placeholder = '/placeholder.jpg') => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target
                        image.src = src
                        image.classList.remove('lazy')
                        observer.unobserve(image)
                    }
                })
            })
            
            img.src = placeholder
            img.classList.add('lazy')
            observer.observe(img)
        } else {
            img.src = src
        }
    },

    // Preload critical images
    preloadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    },

    // Convert to WebP if supported
    getWebPUrl: (url) => {
        if (!url) return ''
        
        const supportsWebP = () => {
            const canvas = document.createElement('canvas')
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        }
        
        if (supportsWebP() && url.includes('cloudinary.com')) {
            return imageOptimizer.getResponsiveUrl(url, 800).replace('f_auto', 'f_webp')
        }
        
        return url
    }
}

// React component for optimized images
import React, { useState, useRef, useEffect } from 'react'

export const OptimizedImage = ({ 
    src, 
    alt, 
    width, 
    height, 
    className = '', 
    lazy = true,
    quality = 80,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const imgRef = useRef(null)

    const optimizedSrc = imageOptimizer.getResponsiveUrl(src, width, quality)
    const srcSet = imageOptimizer.generateSrcSet(src)
    const webpSrc = imageOptimizer.getWebPUrl(src)

    useEffect(() => {
        if (lazy && imgRef.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setLoaded(true)
                        observer.unobserve(imgRef.current)
                    }
                },
                { threshold: 0.1 }
            )
            
            observer.observe(imgRef.current)
            return () => observer.disconnect()
        } else {
            setLoaded(true)
        }
    }, [lazy])

    return (
        <div 
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {/* Placeholder */}
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* Main image */}
            {loaded && !error && (
                <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                        src={optimizedSrc}
                        srcSet={srcSet}
                        sizes={sizes}
                        alt={alt}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            loaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onError={() => setError(true)}
                        loading={lazy ? 'lazy' : 'eager'}
                    />
                </picture>
            )}
            
            {/* Error fallback */}
            {error && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">Image not available</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OptimizedImage