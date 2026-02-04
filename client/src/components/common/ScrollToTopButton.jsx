import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 z-[100] w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-strong hover:bg-accent transition-colors active:scale-95"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopButton;
