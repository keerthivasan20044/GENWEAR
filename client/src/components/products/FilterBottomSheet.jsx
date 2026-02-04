import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import { clearFilters } from '../../redux/slices/productSlice'
import FilterSidebar from './FilterSidebar'

const FilterBottomSheet = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
    const { filters } = useSelector((state) => state.products)

    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const getActiveFilterCount = () => {
        let count = 0
        if (filters.category?.length) count += filters.category.length
        if (filters.type?.length) count += filters.type.length
        if (filters.colors?.length) count += filters.colors.length
        if (filters.sizes?.length) count += filters.sizes.length
        if (filters.materials?.length) count += filters.materials.length
        if (filters.minPrice > 0 || filters.maxPrice < 15000) count += 1
        return count
    }

    const handleApplyFilters = () => {
        onClose()
    }

    const handleClearAll = () => {
        dispatch(clearFilters())
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                {getActiveFilterCount() > 0 && (
                                    <span className="px-2 py-0.5 bg-black text-white text-xs font-semibold rounded-full">
                                        {getActiveFilterCount()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-900" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <FilterSidebar />
                        </div>

                        {/* Footer Actions */}
                        <div className="shrink-0 px-6 py-4 border-t border-gray-200 bg-white">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClearAll}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default FilterBottomSheet
