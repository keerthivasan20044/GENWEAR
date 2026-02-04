import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Search, User, Menu, X, Heart, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ transparent = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.auth);
    const { totalItems } = useSelector(state => state.cart);
    const { items: wishlistItems } = useSelector(state => state.wishlist);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            
            // Determine scroll direction
            setIsScrollingDown(scrollY > lastScrollY && scrollY > 100);
            setLastScrollY(scrollY);
            
            // Determine if scrolled
            setIsScrolled(scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setUserMenuOpen(false);
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchOpen(false);
            setSearchTerm('');
        }
    };

    const navLinks = [
        { name: 'Shop All', path: '/products' },
        { name: 'Men', path: '/products?gender=men' },
        { name: 'Women', path: '/products?gender=women' },
        { name: 'Kids', path: '/products?gender=kids' },
    ];

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isScrollingDown && isScrolled ? -100 : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'py-2 bg-white shadow-lg'
                    : transparent
                    ? 'py-4 bg-transparent'
                    : 'py-4 bg-gradient-to-b from-white/10 to-transparent'
            }`}
        >
            <div className="max-container">
                <div className={`rounded-2xl px-6 md:px-8 py-3 flex items-center justify-between transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white border border-gray-100 shadow-md'
                        : 'bg-white/70 backdrop-blur-md border border-white/20'
                }`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group min-w-fit">
                        <motion.div
                            className="flex flex-col"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <span className={`font-bold tracking-tight transition-all duration-300 ${
                                isScrolled
                                    ? 'text-xl text-slate-900'
                                    : 'text-2xl text-slate-950'
                            }`}>
                                GENWEAR
                            </span>
                            <span className="text-xs font-semibold text-orange-500 tracking-widest uppercase">
                                Premium Fashion
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <motion.div key={link.name} whileHover={{ y: -2 }}>
                                <Link
                                    to={link.path}
                                    className={`text-xs font-semibold uppercase tracking-wide transition-all duration-200 relative pb-1 group ${
                                        location.pathname + location.search === link.path
                                            ? 'text-orange-500'
                                            : 'text-gray-600 hover:text-orange-500'
                                    }`}
                                >
                                    {link.name}
                                    <motion.span
                                        layoutId="nav-underline"
                                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all ${
                                            location.pathname + location.search === link.path
                                                ? 'w-full'
                                                : 'w-0 group-hover:w-full'
                                        }`}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        {/* Search icon */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSearchOpen(true)}
                            className="p-2.5 md:p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-full transition-all duration-200"
                            aria-label="Search"
                        >
                            <Search size={18} />
                        </motion.button>

                        {/* Wishlist */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/wishlist')}
                            className="p-2.5 md:p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-full transition-all duration-200 hidden sm:block relative"
                            aria-label="Wishlist"
                        >
                            <Heart size={18} />
                            {wishlistItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full"
                                >
                                    {wishlistItems.length}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Cart */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/cart"
                                className="relative p-2.5 md:p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-full transition-all duration-200"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingBag size={18} />
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-md"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>
                            {userInfo ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-3 p-1.5 pl-3 bg-slate-50 rounded-full border border-slate-100 hover:border-slate-200 transition-all"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{userInfo.firstName}</span>
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-950 font-black text-xs">
                                            {userInfo.firstName[0]}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-xl rounded-3xl shadow-strong border border-slate-100 py-3 z-[100]"
                                            >
                                                <div className="px-6 py-3 border-b border-slate-50 mb-2">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Details</p>
                                                    <p className="text-xs font-black text-slate-900 truncate">{userInfo.email}</p>
                                                </div>
                                                <Link to="/profile" className="block px-6 py-2.5 text-xs font-black text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all uppercase tracking-widest">Profile Settings</Link>
                                                <Link to="/orders" className="block px-6 py-2.5 text-xs font-black text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all uppercase tracking-widest">Order History</Link>
                                                {userInfo.role === 'admin' && (
                                                    <Link to="/admin" className="block px-6 py-2.5 text-xs font-black text-accent hover:bg-accent/5 transition-all uppercase tracking-widest">Admin Control</Link>
                                                )}
                                                <div className="px-3 mt-3 pt-3 border-t border-slate-50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center justify-between uppercase tracking-widest transition-all"
                                                    >
                                                        <span>Close Session</span>
                                                        <LogOut size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg active:scale-95"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-3 bg-slate-950 text-white rounded-full transition-all active:scale-95"
                            aria-label="Open Menu"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-8"
                    >
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="absolute top-10 right-10 p-5 rounded-full bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-full max-w-4xl">
                            <h2 className="text-[12px] font-black text-slate-400 mb-10 text-center uppercase tracking-[0.5em]">
                                Universal Search
                            </h2>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Looking for something special?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-5xl md:text-7xl font-black text-slate-950 placeholder:text-slate-100 border-none outline-none pb-8 transition-all bg-transparent"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-50 rounded-full" />
                                <motion.div
                                    className="absolute bottom-0 left-0 h-2 bg-slate-950 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: searchTerm ? '100%' : '0%' }}
                                />
                            </form>
                            <div className="mt-12 flex flex-wrap justify-center gap-4">
                                <p className="w-full text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Trending Tags</p>
                                {['Oversized', 'Premium Cotton', 'Cargo', 'Athletic', 'Linen'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => { setSearchTerm(tag); handleSearch({ preventDefault: () => { } }); }}
                                        className="px-6 py-3 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-950 hover:text-white transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 bg-white z-[200] flex flex-col p-8"
                    >
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-slate-950 tracking-tighter">GENWEAR</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation Suite</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block py-6 border-b border-slate-50 text-4xl font-black tracking-tighter uppercase transition-all ${location.pathname + location.search === link.path ? 'text-accent' : 'text-slate-950'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-10 border-t border-slate-50 space-y-4">
                            {userInfo ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/profile" className="flex flex-col p-6 bg-slate-50 rounded-3xl">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account</span>
                                        <span className="text-lg font-black text-slate-950 uppercase tracking-tighter">Profile</span>
                                    </Link>
                                    <Link to="/orders" className="flex flex-col p-6 bg-slate-50 rounded-3xl">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">History</span>
                                        <span className="text-lg font-black text-slate-950 uppercase tracking-tighter">Orders</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="col-span-2 py-6 bg-red-50 text-red-500 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                                    >
                                        Close Session
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary w-full h-20 justify-center text-[12px]">
                                    Log In / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
