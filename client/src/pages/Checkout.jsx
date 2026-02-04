import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { clearCart } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, MapPin, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

    const [shippingData, setShippingData] = useState({
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        phone: userInfo?.phone || ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Card');

    const getProductImage = (product) => {
        if (!product.images) return 'https://via.placeholder.com/400';
        if (Array.isArray(product.images)) return product.images[0];
        return product.images.main || product.images.thumbnail || 'https://via.placeholder.com/400';
    };

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async () => {
        // Simple validation
        if (!shippingData.addressLine || !shippingData.city || !shippingData.pincode) {
            toast.error('Please complete all shipping address fields');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                orderItems: items.map(item => ({
                    product: item.product._id || item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: getProductImage(item.product)
                })),
                shippingAddress: shippingData,
                paymentMethod,
                pricing: {
                    subtotal: totalPrice,
                    shipping: 0,
                    tax: Math.floor(totalPrice * 0.12),
                    discount: 0,
                    total: totalPrice + Math.floor(totalPrice * 0.12)
                }
            };

            const data = await orderAPI.create(orderData);
            dispatch(clearCart());
            toast.success('Order placed successfully!');
            navigate(`/orders/${data._id}`);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="pt-32 pb-40 bg-white">
            <div className="max-container">
                <div className="mb-20">
                    <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">Secure Checkout</p>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Finalize <span className="text-accent">Order</span></h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
                    {/* Main Form Fields */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Steps Indicator */}
                        <div className="flex gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className={`flex-grow h-2 rounded-full transition-all ${step >= i ? 'bg-primary-500' : 'bg-slate-100'}`} />
                            ))}
                        </div>

                        {step === 1 ? (
                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold">1. Shipping <span className="text-accent">Address</span></h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <Input
                                        label="Street Address"
                                        name="addressLine"
                                        value={shippingData.addressLine}
                                        onChange={handleInputChange}
                                        placeholder="Flat, Road, Area"
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={shippingData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                    <Input
                                        label="City"
                                        name="city"
                                        value={shippingData.city}
                                        onChange={handleInputChange}
                                        placeholder="Chennai"
                                    />
                                    <div className="grid grid-cols-2 gap-8">
                                        <Input
                                            label="State"
                                            name="state"
                                            value={shippingData.state}
                                            onChange={handleInputChange}
                                            placeholder="TN"
                                        />
                                        <Input
                                            label="Pincode"
                                            name="pincode"
                                            value={shippingData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="600001"
                                        />
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full h-16 rounded-2xl" onClick={() => setStep(2)}>
                                    Proceed to Payment <ChevronRight size={18} className="ml-4" />
                                </Button>
                            </motion.section>
                        ) : (
                            <motion.section
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                        <CreditCard size={24} />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold">2. Payment <span className="text-accent">Method</span></h3>
                                </div>

                                <div className="grid gap-6">
                                    {['Card', 'UPI', 'COD'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`h-24 rounded-[2rem] border-2 px-10 flex items-center justify-between transition-all group ${paymentMethod === method ? 'bg-slate-900 border-slate-900 text-white shadow-strong scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === method ? 'bg-primary-500' : 'bg-white'}`}>
                                                    {method === 'Card' ? <CreditCard size={20} /> : <ShieldCheck size={20} />}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold uppercase tracking-wider text-xs mb-1">{method === 'COD' ? 'Cash on Delivery' : `${method} Payment`}</p>
                                                    <p className={`text-xs text-slate-400`}>
                                                        {method === 'Card' ? 'Secure Credit/Debit Card' : (method === 'UPI' ? 'Instant UPI Payment' : 'Pay when you receive your order')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method ? 'border-primary-500 bg-primary-500' : 'border-slate-200'
                                                }`}>
                                                {paymentMethod === method && <Lock size={12} className="text-white" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-6">
                                    <Button variant="outline" className="flex-grow h-16 border-slate-100" onClick={() => setStep(1)}>
                                        Back to Shipping
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-[2] h-16 shadow-lg"
                                        onClick={handleSubmitOrder}
                                        loading={loading}
                                    >
                                        Place Order
                                    </Button>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="lg:col-span-4 sticky top-32">
                        <div className="p-10 bg-slate-50 rounded-[3rem] space-y-10 border border-slate-100 shadow-soft">
                            <h3 className="text-xl font-display font-bold">Order <span className="text-accent">Summary</span></h3>

                            <div className="max-h-80 overflow-y-auto pr-4 space-y-6 scrollbar-hide">
                                {items.map(item => (
                                    <div key={item._id} className="flex gap-6">
                                        <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-white">
                                            <img src={getProductImage(item.product)} className="w-full h-full object-cover" alt="item" />
                                        </div>
                                        <div className="flex-grow py-1">
                                            <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">{item.product.name}</h4>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{item.size} / {item.color}</p>
                                            <p className="text-sm font-black text-primary-500 mt-2">₹{item.product.price} <span className="text-slate-300 font-bold ml-2">x{item.quantity}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-slate-200 space-y-6">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 text-sm">₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <span>Tax (12%)</span>
                                    <span className="text-slate-900 text-sm">₹{Math.floor(totalPrice * 0.12)}</span>
                                </div>
                                <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Total</span>
                                    <span className="text-3xl font-display font-bold text-slate-900 tracking-tight">₹{totalPrice + Math.floor(totalPrice * 0.12)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 glass rounded-2xl flex items-center gap-6">
                            <Lock size={20} className="text-green-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure checkout with SSL encryption</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
