import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { toggleWishlist } from '../../redux/slices/wishlistSlice'
import { Heart } from 'lucide-react'
import { toast } from 'react-toastify'

function WishlistButton({ productId, className = '' }) {
    const dispatch = useDispatch()
    const wishlistItems = useSelector((state) => state.wishlist?.items || [])
    const isInWishlist = wishlistItems.includes(productId)

    const handleToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()

        dispatch(toggleWishlist(productId))

        if (isInWishlist) {
            toast.info('Archived from wishlist protocol.')
        } else {
            toast.success('Indexed to wishlist protocol.')
        }
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${isInWishlist
                ? 'bg-accent border-accent text-white shadow-strong shadow-accent/40'
                : 'bg-white/90 backdrop-blur-md border-gray-100 text-primary hover:border-accent hover:text-accent shadow-soft'
                } ${className}`}
            title={isInWishlist ? 'Remove from manifest' : 'Indexing to manifest'}
        >
            <Heart
                size={20}
                strokeWidth={1.5}
                className={isInWishlist ? 'fill-white' : ''}
            />
        </motion.button>
    )
}

export default WishlistButton
