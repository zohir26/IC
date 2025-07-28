"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';

// Simple slugify function
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function FindByBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/brands');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch brands: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle different response structures
      let brandsArray = [];
      
      if (data.success && Array.isArray(data.brands)) {
        // Response format: { success: true, brands: [...] }
        brandsArray = data.brands;
      } else if (Array.isArray(data)) {
        // Response format: [...]
        brandsArray = data;
      } else if (data.brands && Array.isArray(data.brands)) {
        // Response format: { brands: [...] }
        brandsArray = data.brands;
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response format from server');
      }
      
      setBrands(brandsArray);
      console.log('Brands set:', brandsArray); // Debug log
      
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message);
      setBrands([]); // Ensure brands is always an array
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading Manufacturers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Brands</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchBrands}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">Manufacturers</h2>
          </div>
        </div>

        {/* Brands Grid */}
        {Array.isArray(brands) && brands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {brands.map((brand) => (
              <Link key={brand._id || brand.brandId || brand.id} href={`/brands/${slugify(brand.name)}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center justify-center h-16 mb-2">
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-logo.png'; // Fallback image
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No manufacturers found</p>
          </div>
        )}
      </div>
    </section>
  );
}