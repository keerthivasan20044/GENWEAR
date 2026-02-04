import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative mb-12">
                        <h1 className="text-[15rem] md:text-[20rem] font-black italic text-gray-50 leading-none select-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 md:w-44 md:h-44 bg-primary-500 rounded-[3rem] shadow-2xl shadow-primary-200 flex items-center justify-center text-white scale-90 md:scale-100">
                                <AlertCircle size={64} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    <h2 className="heading-3 uppercase italic text-gray-900 mb-6">Coordinate Synchronization Error</h2>
                    <p className="body-base text-gray-500 mb-12 max-w-sm mx-auto font-medium leading-relaxed">
                        The protocol you requested does not exist in the current manifest. Return to base coordinates.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/">
                            <Button className="h-16 px-10 uppercase font-black text-xs tracking-widest flex items-center gap-3">
                                <Home size={18} /> Base Home
                            </Button>
                        </Link>
                        <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-all flex items-center gap-3">
                            <ArrowLeft size={16} /> Return to Archive
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-24 pt-8 border-t border-gray-50">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em]">System Status: LOST IN SPACE V4.0</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
