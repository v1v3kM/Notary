'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  SortAsc,
  SortDesc,
  Grid,
  List
} from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'date' | 'name' | 'price' | 'status';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  price: number;
  tags: string[];
  [key: string]: string | number | string[];
}

interface AdvancedSearchProps {
  items: SearchableItem[];
  onResults: (results: SearchableItem[]) => void;
  categories: string[];
  statuses: string[];
  placeholder?: string;
  showFilters?: boolean;
}

export default function AdvancedSearch({
  items,
  onResults,
  categories,
  statuses,
  placeholder = "Search documents...",
  showFilters = true
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All',
    status: 'All',
    dateRange: { start: '', end: '' },
    priceRange: { min: 0, max: 10000 },
    sortBy: 'date',
    sortOrder: 'desc',
    viewMode: 'grid'
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    setIsSearching(true);
    
    const results = items.filter(item => {
      // Text search
      const searchMatch = !filters.query || 
        item.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));

      // Category filter
      const categoryMatch = filters.category === 'All' || item.category === filters.category;

      // Status filter
      const statusMatch = filters.status === 'All' || item.status === filters.status;

      // Date range filter
      const dateMatch = !filters.dateRange.start || !filters.dateRange.end ||
        (new Date(item.date) >= new Date(filters.dateRange.start) &&
         new Date(item.date) <= new Date(filters.dateRange.end));

      // Price range filter
      const priceMatch = item.price >= filters.priceRange.min && 
                        item.price <= filters.priceRange.max;

      return searchMatch && categoryMatch && statusMatch && dateMatch && priceMatch;
    });

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setTimeout(() => setIsSearching(false), 100);
    return results;
  }, [items, filters]);

  // Update results when filters change
  useMemo(() => {
    onResults(filteredResults);
  }, [filteredResults, onResults]);

  const updateFilter = (key: keyof SearchFilters, value: string | number | { start: string; end: string } | { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'All',
      status: 'All',
      dateRange: { start: '', end: '' },
      priceRange: { min: 0, max: 10000 },
      sortBy: 'date',
      sortOrder: 'desc',
      viewMode: 'grid'
    });
  };

  const activeFiltersCount = [
    filters.category !== 'All',
    filters.status !== 'All',
    filters.dateRange.start || filters.dateRange.end,
    filters.priceRange.min > 0 || filters.priceRange.max < 10000
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                showAdvancedFilters 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Filters */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Controls */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as 'date' | 'name' | 'price' | 'status')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {filters.sortOrder === 'asc' ? 
                <SortAsc className="w-4 h-4" /> : 
                <SortDesc className="w-4 h-4" />
              }
            </button>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => updateFilter('viewMode', 'grid')}
                className={`p-2 ${filters.viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateFilter('viewMode', 'list')}
                className={`p-2 ${filters.viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price Range (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.priceRange.min}
                      onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.priceRange.max}
                      onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) || 10000 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {filteredResults.length} of {items.length} results
          {filters.query && <span> for &quot;{filters.query}&quot;</span>}
        </div>
        <div className="text-xs">
          View: <span className="capitalize">{filters.viewMode}</span>
        </div>
      </div>
    </div>
  );
}
