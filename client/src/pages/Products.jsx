import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import { SlidersHorizontal, X, Grid, List, Search, RotateCcw, LayoutGrid, LayoutList, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts, filterProducts, getCategories } from '../data/mockProducts';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items: apiProducts, loading } = useSelector(state => state.products);

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('gender') || 'all',
        priceRange: { min: 0, max: 20000 },
        colors: [],
        sizes: [],
        sortBy: 'newest',
        search: searchParams.get('q') || ''
    });

    useEffect(() => {
        const gender = searchParams.get('gender') || 'all';
        const query = searchParams.get('q') || '';
        setFilters(prev => ({ ...prev, category: gender, search: query }));
        setSearchTerm(query);
    }, [searchParams]);

    const sourceProducts = useMemo(() => {
        return (apiProducts && apiProducts.length > 0) ? apiProducts : mockProducts;
    }, [apiProducts]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        return filterProducts(sourceProducts, filters);
    }, [sourceProducts, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === 'category') {
            setSearchParams(value === 'all' ? {} : { gender: value });
        }
    };

    const handleMultiSelect = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value]
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: 'all',
            priceRange: { min: 0, max: 20000 },
            colors: [],
            sizes: [],
            sortBy: 'newest',
            search: ''
        });
        setSearchTerm('');
        setSearchParams({});
    };

    const categories = getCategories();

    return (
        <div className="min-h-screen bg-white">

            {/* Immersive Header Section */}
            <section className="pt-40 pb-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-12 h-[2px] bg-orange-500"></span>
                                <span className="text-xs font-black text-orange-500 uppercase tracking-[0.4em]">The Network Collection</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none uppercase tracking-tighter mb-8">
                                Elite <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">Apparel</span>
                            </h1>
                            <p className="text-lg font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                                Technically inspired. Street optimized. Discover the latest drops from the Genwear labs.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="bg-white p-3 rounded-[2rem] shadow-2xl shadow-gray-200 border border-gray-100 flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`} onClick={() => setViewMode('grid')}>
                                    <LayoutGrid size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Grid</span>
                                </div>
                                <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`} onClick={() => setViewMode('list')}>
                                    <LayoutList size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">List</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-10 py-6 rounded-[2.5rem] flex items-center gap-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all ${showFilters ? 'bg-orange-600 text-white' : 'bg-gray-900 text-white'
                                    } shadow-2xl hover:scale-105 active:scale-95`}
                            >
                                <Filter size={20} />
                                {showFilters ? 'Dismiss Filters' : 'Toggle Filters'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Hub & Listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Floating Filter Sidebar */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full lg:w-96 space-y-12 lg:sticky lg:top-32 h-fit"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 uppercase tracking-tighter">
                                        Refine Search
                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-lg uppercase tracking-widest">Active</span>
                                    </h3>
                                    <button onClick={clearFilters} className="p-3 text-gray-300 hover:text-orange-600 transition-all border border-gray-100 rounded-2xl flex items-center gap-2">
                                        <RotateCcw size={18} />
                                    </button>
                                </div>

                                {/* Category Control */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Core Category</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.value}
                                                onClick={() => handleFilterChange('category', cat.value)}
                                                className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] text-sm font-black transition-all border ${filters.category === cat.value
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100 scale-[1.02]'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl">{cat.icon}</span>
                                                    <span className="uppercase tracking-widest">{cat.label}</span>
                                                </div>
                                                {filters.category === cat.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Shield */}
                                <div className="space-y-8 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Pricing Bracket</p>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="500"
                                        value={filters.priceRange.max}
                                        onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                    />
                                    <div className="flex justify-between items-center text-sm font-black text-gray-900 uppercase">
                                        <span className="bg-white px-4 py-2 rounded-xl shadow-sm tracking-tighter">₹0</span>
                                        <div className="w-12 h-px bg-gray-200"></div>
                                        <span className="bg-white px-4 py-2 rounded-xl shadow-sm tracking-tighter text-orange-600">₹{filters.priceRange.max}</span>
                                    </div>
                                </div>

                                {/* Size Specs */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Measurement Selection</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['S', 'M', 'L', 'XL', '28', '30', '32', '34'].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => handleMultiSelect('sizes', size)}
                                                className={`h-16 rounded-[1rem] flex items-center justify-center text-xs font-black transition-all border ${filters.sizes.includes(size)
                                                        ? 'bg-gray-900 border-gray-900 text-white shadow-xl'
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Elite Grid Section */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">
                                Catalog Result / <span className="text-gray-900 italic">{filteredProducts.length} Entries Identified</span>
                            </span>

                            <div className="hidden sm:block">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 focus:ring-0 cursor-pointer"
                                >
                                    <option value="newest">Sort by: NEW ERA</option>
                                    <option value="price-low">Sort by: VALUE LOW</option>
                                    <option value="price-high">Sort by: PREMIUM HIGH</option>
                                    <option value="rating">Sort by: TOP RATED</option>
                                </select>
                            </div>
                        </div>

                        {loading && sourceProducts.length === 0 ? (
                            <ProductSkeleton count={6} />
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-gray-50 rounded-[4rem] p-24 text-center border-2 border-dashed border-gray-100">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-orange-600 mx-auto mb-10 shadow-xl">
                                    <Search size={44} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Negative Signal</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-tight mb-12 text-sm italic">No data profiles match your current frequency. Reset and calibrate.</p>
                                <button onClick={clearFilters} className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-2xl transition-all">Clear Protocol</button>
                            </div>
                        ) : (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-x-10 gap-y-16`}>
                                {filteredProducts.map((p, idx) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (idx % 6) * 0.1, duration: 0.8 }}
                                    >
                                        <ProductCard product={p} viewMode={viewMode} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
