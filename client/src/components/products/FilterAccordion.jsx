import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

function FilterAccordion({ title, children, activeCount = 0 }) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="border-b border-gray-100 py-6 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                        {title}
                    </span>
                    {activeCount > 0 && (
                        <span className="w-5 h-5 bg-accent text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-soft">
                            {activeCount}
                        </span>
                    )}
                </div>
                <div className="text-gray-300 group-hover:text-primary transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6 space-y-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FilterAccordion
