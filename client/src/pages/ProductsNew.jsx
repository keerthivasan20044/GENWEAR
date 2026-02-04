import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { productAPI } from '../services/api'
import ProductCard from '../components/products/ProductCard'
import FilterSidebarNew from '../components/products/FilterSidebarNew'
import ProductSkeleton from '../components/products/ProductSkeleton'
import SortDropdown from '../components/products/SortDropdown'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Get active filters from URL params
  const getActiveFilters = useCallback(() => {
    const filters = {}
    for (const [key, value] of searchParams.entries()) {
      if (value) filters[key] = value
    }
    return filters
  }, [searchParams])

  const activeFilters = getActiveFilters()

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = Object.fromEntries(searchParams.entries())
      const response = await productAPI.getProducts(params)
      
      setProducts(response.products || [])
      setFilters(response.filters || {})
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    const updatedParams = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        updatedParams.set(key, value)
      } else {
        updatedParams.delete(key)
      }
    })
    
    setSearchParams(updatedParams)
  }, [searchParams, setSearchParams])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchParams({})
    setSearchTerm('')
  }, [setSearchParams])

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      handleFilterChange({ search: searchTerm.trim() })
    } else {
      const params = new URLSearchParams(searchParams)
      params.delete('search')
      setSearchParams(params)
    }
  }, [searchTerm, handleFilterChange, searchParams, setSearchParams])

  // Handle sort change
  const handleSortChange = useCallback((sortValue) => {
    handleFilterChange({ sort: sortValue })
  }, [handleFilterChange])

  // Initialize search term from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || ''
    setSearchTerm(searchFromUrl)
  }, [searchParams])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle mobile filter toggle
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const getFilterCount = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] && activeFilters[key] !== ''
    ).length
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Title and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `${products.length} products found`}
                </p>
              </div>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </form>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Filter Toggle & Count */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleFilters}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {getFilterCount() > 0 && (
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      {getFilterCount()}
                    </span>
                  )}
                </button>
                
                {/* Active Filters Display */}
                {getFilterCount() > 0 && (
                  <div className="hidden lg:flex items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value) return null
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                          >
                            {key}: {value}
                            <button
                              onClick={() => handleFilterChange({ [key]: '' })}
                              className="hover:bg-orange-200 rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                <SortDropdown 
                  value={activeFilters.sort || ''}
                  onChange={handleSortChange}
                />
                
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebarNew
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Mobile Filters */}
          <FilterSidebarNew
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobile={true}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-2 text-red-700 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <div className={`
                grid gap-6
                ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
                }
              `}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={`
                  grid gap-6
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                  }
                `}
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard 
                        product={product} 
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products