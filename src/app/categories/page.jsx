"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, ChevronRight, Star, Package, Users, TrendingUp } from 'lucide-react';

export default function ViewAllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories.json');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories?.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Categories</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore our comprehensive range of electronic components and find exactly what you need
            </p>
          </div>

          {/* Search and Controls */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredCategories.length} of {categories.length} categories
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Categories Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <CategoryListItem key={category.id} category={category} />
            ))}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Category Card Component for Grid View
function CategoryCard({ category }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <img 
              src={category.icon} 
              alt={category.name}
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.subcategories?.length || 0} subcategories</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Subcategories Preview */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Subcategories</h4>
            <div className="space-y-1">
              {category.subcategories.slice(0, 3).map((sub) => (
                <Link 
                  key={sub.id} 
                  href={sub.link}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  • {sub.name}
                </Link>
              ))}
              {category.subcategories.length > 3 && (
                <p className="text-sm text-gray-500">+{category.subcategories.length - 3} more</p>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {category.popularParts?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Parts</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {category.topManufacturers?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Brands</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {category.subcategories?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Types</div>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href={`/topCategories/details/${category.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Explore Category
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Category List Item Component for List View
function CategoryListItem({ category }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center gap-6">
        {/* Icon */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <img 
            src={category.icon} 
            alt={category.name}
            className="w-12 h-12"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.details?.description}</p>
            </div>
            <Link 
              href={`/topCategories/details/${category.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {category.popularParts?.length || 0} popular parts
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {category.topManufacturers?.length || 0} manufacturers
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {category.subcategories?.length || 0} subcategories
            </div>
          </div>

          {/* Top Manufacturers */}
          {category.topManufacturers && category.topManufacturers.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-gray-500">Top brands: </span>
              <span className="text-sm text-gray-700">
                {category.topManufacturers.slice(0, 3).map(m => m.name).join(', ')}
                {category.topManufacturers.length > 3 && ` +${category.topManufacturers.length - 3} more`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}