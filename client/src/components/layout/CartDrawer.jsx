import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../redux/slices/cartSlice';
import { useNavigate, Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
    const { items, totalPrice } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            console.log('CartDrawer opened, Link defined:', typeof Link !== 'undefined');
        }
    }, [isOpen]);

    const handleUpdateQty = (id, current, delta) => {
        if (current + delta > 0) {
            dispatch(updateCartItem({ id, quantity: current + delta }));
        }
    };

    const getProductImage = (product) => {
        if (!product || !product.images) return 'https://via.placeholder.com/400';
        if (Array.isArray(product.images)) return product.images[0];
        return product.images.main || product.images.thumbnail || 'https://via.placeholder.com/400';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Your Bag</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} Items</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase">Your bag is empty</h3>
                                    <button
                                        onClick={() => { onClose(); navigate('/products'); }}
                                        className="text-orange-600 font-black text-sm uppercase tracking-widest hover:underline"
                                    >
                                        Start Exploring
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item._id} className="flex gap-6 group">
                                        <Link to={`/products/${item.product?._id || item.product?.id}`} className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                            <img
                                                src={getProductImage(item.product)}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </Link>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-bold text-gray-900 uppercase text-sm leading-tight line-clamp-2">{item.product?.name}</h4>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item._id))}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
                                                {item.size} / {item.color}
                                            </p>
                                            <div className="mt-auto flex justify-between items-center">
                                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                    <button onClick={() => handleUpdateQty(item._id, item.quantity, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Minus size={14} /></button>
                                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQty(item._id, item.quantity, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Plus size={14} /></button>
                                                </div>
                                                <span className="font-black text-gray-900">₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-gray-50 rounded-t-[3rem] border-t border-gray-100">
                                <div className="flex justify-between mb-8">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={() => { onClose(); navigate('/checkout'); }}
                                    className="w-full py-6 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-950/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-4"
                                >
                                    {userInfo ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
