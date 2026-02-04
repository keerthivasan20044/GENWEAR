import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../../redux/slices/productSlice';
import PriceSlider from './PriceSlider';
import { Check, RotateCcw } from 'lucide-react';

// Filter Options
const GENDERS = ['men', 'women', 'kids'];
const CATEGORIES = ['topwear', 'bottomwear', 'outerwear', 'accessories', 'footwear'];
const COLORS = [
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'red', hex: '#EF4444' },
    { name: 'blue', hex: '#3B82F6' },
    { name: 'green', hex: '#10B981' },
    { name: 'yellow', hex: '#F59E0B' },
    { name: 'purple', hex: '#A855F7' },
    { name: 'brown', hex: '#92400E' },
    { name: 'gray', hex: '#6B7280' },
    { name: 'olive', hex: '#3D5229' },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const MATERIALS = ['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece'];
const FITS = ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized', 'Tailored Fit', 'Athletic Fit'];
const BRANDS = ['GENWEAR', 'Urban Threads', 'Modern Fit', 'Street Style', 'Beach Breeze', 'Fashionista', 'ChicStyle'];
const PRICE_RANGES = [
    { label: 'Under ₹2K', min: 0, max: 2000 },
    { label: '₹2K - ₹5K', min: 2000, max: 5000 },
    { label: '₹5K - ₹10K', min: 5000, max: 10000 },
    { label: 'Over ₹10K', min: 10000, max: 999999 },
];

const FilterSidebar = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.products);

    const handleFilterChange = (type, value) => {
        const currentVals = filters[type] || [];
        const isSelected = currentVals.includes(value);
        const newVals = isSelected
            ? currentVals.filter(v => v !== value)
            : [...currentVals, value];
        dispatch(setFilters({ [type]: newVals }));
    };

    const handlePriceRangeClick = (min, max) => {
        dispatch(setFilters({ priceRange: [min, max] }));
    };

    const isColorSelected = (colorName) => {
        return filters.colors?.includes(colorName);
    };

    const isSizeSelected = (size) => {
        return filters.sizes?.includes(size);
    };

    return (
        <div className="space-y-10">
            {/* Header with Clear All */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                    onClick={() => dispatch(clearFilters())}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors group"
                >
                    <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    Clear All
                </button>
            </div>

            {/* Gender */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Gender</h3>
                <div className="space-y-3">
                    {GENDERS.map(gender => (
                        <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.gender === gender
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'border-gray-300 group-hover:border-primary-400'
                                }`}>
                                {filters.gender === gender && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="radio"
                                className="hidden"
                                checked={filters.gender === gender}
                                onChange={() => dispatch(setFilters({ gender: filters.gender === gender ? null : gender }))}
                            />
                            <span className={`text-sm font-medium capitalize ${filters.gender === gender ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {gender}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Product Type</h3>
                <div className="space-y-3">
                    {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.category?.includes(cat)
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'border-gray-300 group-hover:border-primary-400'
                                }`}>
                                {filters.category?.includes(cat) && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.category?.includes(cat)}
                                onChange={() => handleFilterChange('category', cat)}
                            />
                            <span className={`text-sm font-medium capitalize ${filters.category?.includes(cat) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map(color => (
                        <button
                            key={color.name}
                            onClick={() => handleFilterChange('colors', color.name)}
                            className={`relative w-10 h-10 rounded-full transition-all ${isColorSelected(color.name)
                                    ? 'ring-2 ring-primary-600 ring-offset-2 scale-110'
                                    : 'hover:scale-110'
                                }`}
                            title={color.name}
                        >
                            <div
                                className="w-full h-full rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: color.hex }}
                            />
                            {isColorSelected(color.name) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Check
                                        size={16}
                                        className={color.name === 'white' ? 'text-gray-900' : 'text-white'}
                                        strokeWidth={3}
                                    />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            onClick={() => handleFilterChange('sizes', size)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isSizeSelected(size)
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Materials */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Materials</h3>
                <div className="space-y-3">
                    {MATERIALS.map(material => (
                        <label key={material} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.materials?.includes(material)
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'border-gray-300 group-hover:border-primary-400'
                                }`}>
                                {filters.materials?.includes(material) && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.materials?.includes(material)}
                                onChange={() => handleFilterChange('materials', material)}
                            />
                            <span className={`text-sm font-medium ${filters.materials?.includes(material) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {material}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Fits/Styles */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Fit & Style</h3>
                <div className="space-y-3">
                    {FITS.map(fit => (
                        <label key={fit} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.fits?.includes(fit)
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'border-gray-300 group-hover:border-primary-400'
                                }`}>
                                {filters.fits?.includes(fit) && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.fits?.includes(fit)}
                                onChange={() => handleFilterChange('fits', fit)}
                            />
                            <span className={`text-sm font-medium ${filters.fits?.includes(fit) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {fit}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Slider */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Price Range</h3>
                <PriceSlider />
            </div>

            {/* Quick Price Filters */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Quick Price</h3>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range, index) => (
                        <button
                            key={index}
                            onClick={() => handlePriceRangeClick(range.min, range.max)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-left transition-all ${filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Brands</h3>
                <div className="space-y-3">
                    {BRANDS.map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.brands?.includes(brand)
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'border-gray-300 group-hover:border-primary-400'
                                }`}>
                                {filters.brands?.includes(brand) && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.brands?.includes(brand)}
                                onChange={() => handleFilterChange('brands', brand)}
                            />
                            <span className={`text-sm font-medium ${filters.brands?.includes(brand) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Stock Status */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${filters.inStock
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300 group-hover:border-primary-400'
                        }`}>
                        {filters.inStock && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                        )}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.inStock || false}
                        onChange={() => dispatch(setFilters({ inStock: !filters.inStock }))}
                    />
                    <span className={`text-sm font-medium ${filters.inStock ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                        In Stock Only
                    </span>
                </label>
            </div>
        </div>
    );
};

export default FilterSidebar;
