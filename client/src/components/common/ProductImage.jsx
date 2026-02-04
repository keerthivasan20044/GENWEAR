import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ProductImage Component
 * Handles product images with loading states, error handling, and fallbacks
 */
const ProductImage = ({
    src,
    alt = 'Product Image',
    fallback = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    className = '',
    loading = 'lazy',
    onError: customOnError
}) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleError = () => {
        if (currentSrc !== fallback) {
            // Try fallback image
            setCurrentSrc(fallback);
            setError(false);
        } else {
            // Both original and fallback failed
            setError(true);
            if (customOnError) customOnError();
        }
    };

    const handleLoad = () => {
        setLoaded(true);
    };

    if (error) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
                <div className="text-center text-gray-400 p-8">
                    <ImageOff className="w-12 h-12 mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-sm font-medium">Image unavailable</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Loading skeleton */}
            {!loaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}

            {/* Actual image */}
            <img
                src={currentSrc}
                alt={alt}
                loading={loading}
                onError={handleError}
                onLoad={handleLoad}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
                    }`}
            />
        </div>
    );
};

ProductImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.oneOf(['lazy', 'eager']),
    onError: PropTypes.func
};

export default ProductImage;
