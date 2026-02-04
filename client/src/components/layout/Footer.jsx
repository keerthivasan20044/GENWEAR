import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter, Facebook, ShoppingBag, Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter leading-none">GENWEAR</span>
                            <span className="text-xs text-orange-500 font-bold tracking-[0.3em] mt-1 uppercase">Premium Fashion</span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed font-bold uppercase tracking-tight">
                            Elite technical apparel engineered for the modern world. Quality craftsmanship meets progressive design.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-orange-500">Shop Collections</h4>
                        <ul className="space-y-4">
                            {['All Products', "Men's Wear", "Women's Studio", 'Kids Range', 'New Arrivals'].map((item) => (
                                <li key={item}>
                                    <Link to="/products" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-orange-500">Customer Support</h4>
                        <ul className="space-y-4">
                            {['Track Order', 'Shipping Info', 'Returns & Exchanges', 'Care Guide', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-orange-500">Contact Elite</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <MapPin size={20} className="text-orange-500 shrink-0" />
                                <span className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                                    123 Fashion District<br />
                                    Chennai, TN 600001
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Phone size={20} className="text-orange-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">+91 93457 37726</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Mail size={20} className="text-orange-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">contact@genwear.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">© 2026 GENWEAR. Elite Access Reserved.</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                            <Zap size={14} className="text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Dev: Keerthivasan</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
