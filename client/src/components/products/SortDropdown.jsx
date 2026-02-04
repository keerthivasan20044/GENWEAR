import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BarChart2 } from 'lucide-react'

const SORT_OPTIONS = [
    { label: 'Latest Protocol', value: 'newest' },
    { label: 'Value: Low to High', value: 'price_asc' },
    { label: 'Value: High to Low', value: 'price_desc' },
]

function SortDropdown({ currentSort, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = SORT_OPTIONS.find(opt => opt.value === currentSort) || SORT_OPTIONS[0]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl hover:border-primary-500 transition-all group"
            >
                <BarChart2 size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">{selectedOption.label}</span>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-3xl shadow-premium z-30 overflow-hidden"
                    >
                        <div className="p-3">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onSortChange(opt.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${currentSort === opt.value
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SortDropdown
