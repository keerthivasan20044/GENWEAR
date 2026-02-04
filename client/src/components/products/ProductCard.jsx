import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart, Eye, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);

    if (!product) return null;

    const productId = product._id || product.id;

    const getProductImage = () => {
        if (!product.images) return 'https://via.placeholder.com/800';
        if (Array.isArray(product.images)) return product.images[0] || 'https://via.placeholder.com/800';
        return product.images.main || product.images.thumbnail || 'https://via.placeholder.com/800';
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(addToCart({
            product,
            quantity: 1,
            size: product.sizes?.[0]?.size || product.sizes?.[0] || 'M',
            color: typeof product.colors?.[0] === 'string' ? product.colors[0] : (product.colors?.[0]?.name || 'Default')
        }));

        toast.dark(`Added ${product.name} to bag`, {
            icon: <ShoppingBag size={18} className="text-orange-500" />,
            position: "bottom-center",
            autoClose: 2000,
        });
    };

    const { items: wishlistItems } = useSelector(state => state.wishlist || { items: [] });
    const isWishlisted = wishlistItems?.includes(productId);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
    };

    const discount = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            layout
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`group relative h-full flex flex-col`}
        >
            <Link to={`/products/${productId}`} className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/60 hover:border-orange-200 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)]">

                {/* Visual Section */}
                <div className={`relative overflow-hidden bg-gray-50 flex-shrink-0 ${viewMode === 'list' ? 'w-full md:w-80' : 'aspect-[4/5]'}`}>
                    <img
                        src={getProductImage()}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-5 left-5 flex flex-col gap-2">
                        {discount > 0 && (
                            <div className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-orange-950/20 uppercase tracking-[0.1em]">
                                {discount}% Off
                            </div>
                        )}
                        {product.isNewArrival && (
                            <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-4 py-2 rounded-xl border border-white/40 uppercase tracking-[0.2em]">
                                New Era
                            </div>
                        )}
                    </div>

                    {/* Premium Hover Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="bg-white text-gray-900 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                        >
                            <ShoppingBag size={18} />
                            Add to bag
                        </button>
                    </div>

                    {/* Wishlist Toggle */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-5 right-5 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-xl border ${isWishlisted
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'bg-white/80 border-white/40 text-gray-400 hover:text-orange-600'
                            }`}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>

                    {/* Visual Indicator of details */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase truncate max-w-[150px]">
                            {product.brand || 'Elite Series'}
                        </span>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100/50">
                            <Star size={12} fill="#F97316" className="text-orange-500" />
                            <span className="text-[10px] font-black text-gray-900 leading-none">{product.rating?.average || product.rating || 4.5}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 uppercase tracking-tight mb-4 flex-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                        <div className="flex flex-col">
                            {product.originalPrice > product.price && (
                                <span className="text-[11px] font-bold text-gray-300 line-through tracking-tighter decoration-orange-500/30">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                            <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                        </div>

                        {/* Variant Dots */}
                        <div className="flex -space-x-1.5">
                            {(product.colors || []).slice(0, 3).map((c, i) => (
                                <div
                                    key={i}
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-xl ring-1 ring-gray-100"
                                    style={{ backgroundColor: typeof c === 'string' ? c.toLowerCase() : (c.hex || '#ddd') }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
