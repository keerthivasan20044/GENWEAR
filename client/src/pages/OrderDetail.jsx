import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, CheckCircle, ArrowLeft, MapPin, Receipt, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderAPI.getOrderById(id);
                setOrder(data);
            } catch (error) {
                toast.error('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-40 text-center uppercase font-bold tracking-widest animate-pulse">
            Loading Order Details...
        </div>
    );

    if (!order) return (
        <div className="min-h-screen pt-40 text-center">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Order Not Found</h2>
            <Link to="/orders" className="btn-primary inline-flex">Back to Orders</Link>
        </div>
    );

    const StatusStep = ({ icon: Icon, label, active, completed }) => (
        <div className="flex flex-col items-center gap-4 relative flex-1">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${completed ? 'bg-accent text-white shadow-lg shadow-accent/20' : active ? 'bg-white border-2 border-accent text-accent animate-pulse' : 'bg-slate-100 text-slate-300'
                }`}>
                <Icon size={24} />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest text-center ${active || completed ? 'text-slate-900' : 'text-slate-300'}`}>{label}</p>
        </div>
    );

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = statuses.indexOf(order.orderStatus);

    return (
        <div className="min-h-screen bg-white pt-32 pb-40">
            <div className="max-container">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-accent mb-6 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Orders
                        </Link>
                        <p className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">Order Details</p>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Order ID: <span className="text-accent">{order.orderNumber}</span></h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Status Tracker */}
                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-10 flex items-center gap-4">
                                <Clock size={16} /> Order Status
                            </h3>
                            <div className="flex justify-between relative">
                                <div className="absolute top-7 left-0 right-0 h-px bg-slate-200 -z-0"></div>
                                <StatusStep icon={ShieldCheck} label="Pending" completed={currentIdx >= 0} active={currentIdx === 0} />
                                <StatusStep icon={CheckCircle} label="Confirmed" completed={currentIdx >= 1} active={currentIdx === 1} />
                                <StatusStep icon={Package} label="Processing" completed={currentIdx >= 2} active={currentIdx === 2} />
                                <StatusStep icon={Truck} label="Shipped" completed={currentIdx >= 3} active={currentIdx === 3} />
                                <StatusStep icon={CheckCircle} label="Delivered" completed={currentIdx >= 4} active={currentIdx === 4} />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Items ({order.items.length})</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-8 p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-soft transition-all">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 uppercase tracking-tight">{item.name}</h4>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full text-slate-400">{item.size}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full text-slate-400">{item.color}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full text-slate-400">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 text-lg">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Shipping Info */}
                        <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/30 transition-all"></div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-8 flex items-center gap-4">
                                <MapPin size={16} /> Shipping Address
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm font-medium leading-relaxed opacity-90 text-white">
                                    {order.shippingAddress?.addressLine || 'Address details missing'}<br />
                                    {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}<br />
                                    {order.shippingAddress?.pincode || 'N/A'}
                                </p>
                                <p className="text-xs font-bold uppercase tracking-wider pt-4 border-t border-white/10 text-white/60">
                                    Contact: {order.shippingAddress?.phone || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-4">
                                <Receipt size={16} /> Order Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{order.pricing.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 pb-4 border-b border-slate-200">
                                    <span>Tax 12%</span>
                                    <span>₹{order.pricing.tax}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Amount</span>
                                    <span className="text-3xl font-display font-bold text-slate-900 tracking-tight">₹{order.pricing.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Payment {order.paymentStatus}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg text-slate-400">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
