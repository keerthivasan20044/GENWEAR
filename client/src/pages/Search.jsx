import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import { Search as SearchIcon, Filter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            setLoading(true);
            try {
                // We use the search filter in getProducts or a dedicated search method
                const response = await apiService.getProducts({ search: query, limit: 100 });
                setProducts(response.products);
            } catch (error) {
                console.error('Search extraction failure:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            performSearch();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">Search results</p>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                        Results for <span className="text-accent">"{query}"</span>
                    </h1>
                    <div className="h-1.5 w-20 bg-accent rounded-full"></div>
                </div>

                {loading ? (
                    <ProductSkeleton count={8} />
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-2xl border border-slate-100 text-center px-6"
                    >
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                            <SearchIcon size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">No Products Found</h2>
                        <p className="text-slate-600 mb-10 max-w-sm">We couldn't find any products matching your search. Try different keywords or browse our full collection.</p>
                        <Link to="/products" className="btn-primary">
                            Browse All Products <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
