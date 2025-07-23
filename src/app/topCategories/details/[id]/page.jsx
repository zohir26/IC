// app/TopCategories/details/[id]/page.jsx - Enhanced with subcategories, manufacturers, and popular parts
"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Star, 
  Package, 
  ExternalLink, 
  TrendingUp,
  Users,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { useCategory } from '@/app/hooks/useCategories';

export default function CategoryDetails() {
  const params = useParams();
  const router = useRouter();
  
  // Use the custom hook - switch useAPI to true for MongoDB, false for static JSON
  const { category, loading, error } = useCategory(params.id, false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4 text-lg">{error || 'Category not found'}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium px-6 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/categories" className="text-gray-500 hover:text-gray-700 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Categories
          </button>
          
          <div className="flex items-center gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src={category.icon} 
                alt={category.name}
                className="w-20 h-20"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-blue-100 mb-4">Comprehensive information and resources</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                {category.subcategories && (
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{category.subcategories.length} subcategories</span>
                  </div>
                )}
                {category.topManufacturers && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{category.topManufacturers.length} top manufacturers</span>
                  </div>
                )}
                {category.popularParts && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{category.popularParts.length} popular parts</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                {category.details.description}
              </p>
            </div>

            {/* Subcategories Section */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Subcategories</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.subcategories.map((subcategory) => (
                    <Link 
                      key={subcategory.id} 
                      href={subcategory.link}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {subcategory.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subcategory.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Parts Section */}
            {category.popularParts && category.popularParts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Popular Parts</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {category.popularParts.length} parts
                  </span>
                </div>
                <div className="grid gap-4">
                  {category.popularParts.slice(0, 6).map((part) => (
                    <div 
                      key={part.id} 
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <img 
                        src={part.image} 
                        alt={part.partNumber}
                        className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-2"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {part.partNumber}
                            </h3>
                            <p className="text-sm text-gray-600">{part.manufacturer}</p>
                            <p className="text-sm text-gray-500 mt-1">{part.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{part.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">{part.price}</div>
                            <div className={`text-sm flex items-center gap-1 ${part.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${part.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              {part.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                            {part.popularity && (
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {part.popularity}% popular
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={part.link}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {category.popularParts.length > 6 && (
                  <div className="text-center mt-6">
                    <button className="text-blue-600 hover:text-blue-800 font-medium px-6 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      View all {category.popularParts.length} popular parts →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Applications Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {category.details.applications.map((app, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="space-y-4">
                {category.details.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Manufacturers */}
            {category.topManufacturers && category.topManufacturers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Manufacturers</h3>
                <div className="space-y-4">
                  {category.topManufacturers.map((manufacturer) => (
                    <div key={manufacturer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src={manufacturer.logo} 
                          alt={manufacturer.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600" style={{display: 'none'}}>
                          {manufacturer.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{manufacturer.name}</div>
                        <div className="text-xs text-gray-500">
                          {manufacturer.specialties.slice(0, 2).join(', ')}
                          {manufacturer.specialties.length > 2 && ` +${manufacturer.specialties.length - 2}`}
                        </div>
                      </div>
                      <a 
                        href={manufacturer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Info Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Market Information</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {category.details.marketInfo}
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link 
                  href={category.link}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Browse Products</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
                <Link 
                  href="/resources"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Technical Resources</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
                <Link 
                  href="/contact"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Get Support</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Help Choosing?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Our experts can help you find the right components for your project.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}