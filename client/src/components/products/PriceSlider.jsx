import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../redux/slices/productSlice';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PriceSlider = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.products);

    const [min, setMin] = useState(filters.minPrice || 0);
    const [max, setMax] = useState(filters.maxPrice || 20000);

    // Update local state when filters change (from outside)
    useEffect(() => {
        setMin(filters.minPrice || 0);
        setMax(filters.maxPrice || 20000);
    }, [filters.minPrice, filters.maxPrice]);

    const handlePriceChange = (newMin, newMax) => {
        dispatch(setFilters({ minPrice: newMin, maxPrice: newMax }));
    };

    const quickPrices = [
        { label: 'Under ₹2k', min: 0, max: 2000 },
        { label: '₹2k - ₹5k', min: 2000, max: 5000 },
        { label: 'Over ₹10k', min: 10000, max: 20000 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Floor</span>
                    <span className="text-sm font-black text-gray-900 tracking-tight">₹{min.toLocaleString()}</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex flex-col text-right">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Ceiling</span>
                    <span className="text-sm font-black text-gray-900 tracking-tight">₹{max.toLocaleString()}</span>
                </div>
            </div>

            <div className="relative pt-2 pb-6">
                <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={max}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setMax(val);
                        handlePriceChange(min, val);
                    }}
                    className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between mt-4 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    <span>₹0</span>
                    <span>₹10k</span>
                    <span>₹20k+</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {quickPrices.map((price) => {
                    const active = filters.minPrice === price.min && filters.maxPrice === price.max;
                    return (
                        <button
                            key={price.label}
                            onClick={() => handlePriceChange(price.min, price.max)}
                            className={`py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 text-left flex justify-between items-center group ${active
                                ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/20'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-primary-200 hover:text-gray-900'
                                }`}
                        >
                            {price.label}
                            <div className={`transition-all duration-300 ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                                <ArrowRight size={14} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PriceSlider;
