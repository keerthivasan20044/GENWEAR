import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

function CartDrawer({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalItems, totalAmount } = useSelector((state) => state.cart);

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
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
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[110] flex flex-col shadow-strong"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h2 className="text-xl font-display font-bold text-slate-900">
                                    Shopping Cart
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 mb-1">Your cart is empty</p>
                                        <p className="text-sm text-slate-600">Add items to get started</p>
                                    </div>
                                    <button
                                        onClick={() => { onClose(); navigate('/products'); }}
                                        className="btn-primary mt-4"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            key={item.productId}
                                            className="flex gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                        >
                                            {/* Product Image */}
                                            <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-slate-900 text-sm leading-tight pr-2">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleRemove(item.productId)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                {/* Size & Color */}
                                                {(item.size || item.color) && (
                                                    <p className="text-xs text-slate-600 mb-2">
                                                        {item.size && `Size: ${item.size}`}
                                                        {item.size && item.color && ' • '}
                                                        {item.color && `Color: ${item.color}`}
                                                    </p>
                                                )}

                                                {/* Price & Quantity */}
                                                <div className="flex items-center justify-between mt-auto">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-slate-200 rounded-lg">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <p className="font-bold text-slate-900">
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                                {/* Free Shipping Banner */}
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Truck size={20} className="text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">Free Shipping</p>
                                        <p className="text-xs text-slate-600">On orders over ₹50</p>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-slate-600">Subtotal</span>
                                    <span className="text-2xl font-bold text-slate-900">
                                        ₹{totalAmount.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 text-center">
                                    Taxes and shipping calculated at checkout
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { onClose(); navigate('/cart'); }}
                                        className="flex-1 btn-secondary justify-center"
                                    >
                                        View Cart
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex-[2] btn-primary justify-center group"
                                    >
                                        Checkout
                                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CartDrawer;
