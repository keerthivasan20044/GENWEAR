import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="w-24 h-24 border-4 border-gray-100 border-t-orange-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={32} className="text-orange-600 fill-orange-600 animate-pulse" />
                </div>
            </motion.div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic"
            >
                Synchronizing Network...
            </motion.p>
        </div>
    );
};

export default PageLoader;
