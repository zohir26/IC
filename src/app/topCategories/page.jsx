"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCategories} from '@/app/hooks/useCategories';
import { ArrowRight, Package, Users, TrendingUp } from 'lucide-react';

export default function TopCategory() {
  // Use the custom hook with limit to show only top categories
  // You can switch between API and static JSON by changing useAPI
  const { categories, loading, error } = useCategories({ 
    limit: 8,
    useAPI: false // Set to true to use MongoDB API, false for static JSON
  });

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>Error loading categories: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header with View All Link */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
              <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">TOP CATEGORIES</h2>
            </div>
            
            {/* View All Categories Link */}
            <Link 
              href="/categories"
              className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 border-2 border-blue-800 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/topCategories/details/${category.id}`}>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 hover:border-blue-200">
                <div className="flex flex-col items-center text-center">
                  {/* Category Icon */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-200">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-12 h-12 mx-auto"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                    {category.name}
                  </h3>
                  
                  {/* Enhanced Info - Show subcategories, manufacturers, and parts count */}
                  {(category.subcategories || category.topManufacturers || category.popularParts) && (
                    <div className="text-xs text-gray-500 space-y-1 w-full">
                      {category.subcategories && (
                        <div className="flex items-center justify-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{category.subcategories.length} subcategories</span>
                        </div>
                      )}
                      {category.topManufacturers && (
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{category.topManufacturers.length} manufacturers</span>
                        </div>
                      )}
                      {category.popularParts && (
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{category.popularParts.length} popular parts</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Manufacturers Preview */}
                  {category.topManufacturers && category.topManufacturers.length > 0 && (
                    <div className="mt-3 w-full">
                      <div className="text-xs text-gray-400 mb-1">Top brands:</div>
                      <div className="text-xs text-gray-600 font-medium">
                        {category.topManufacturers.slice(0, 2).map(m => m.name).join(', ')}
                        {category.topManufacturers.length > 2 && ` +${category.topManufacturers.length - 2}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Categories Button */}
        <div className="text-center mt-12">
          <Link 
            href="/categories"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-gray-500 text-sm mt-3">
            Discover our complete range of electronic components and solutions
          </p>
        </div>
      </div>
    </section>
  );
}