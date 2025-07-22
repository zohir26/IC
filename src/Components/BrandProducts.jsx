"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Package, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { api, formatPrice, slugify } from '@/lib/utils';

export default function BrandProducts({ brandName }) {
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (brandName) {
      fetchBrandProducts();
    }
  }, [brandName]);

  const fetchBrandProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/brands/${brandName}`);
      setBrandData(data);
    } catch (err) {
      console.error('Error fetching brand products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/brands/${brandName}/products/${productId}`);
  };

  const getStockStatus = (stock) => {
    if (stock > 1000) return { status: 'In Stock', color: 'text-green-600', icon: CheckCircle };
    if (stock > 0) return { status: 'Low Stock', color: 'text-yellow-600', icon: Package };
    return { status: 'Out of Stock', color: 'text-red-600', icon: XCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchBrandProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/brands')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Brands
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src={brandData?.logo} 
                alt={brandData?.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{brandData?.name}</h1>
                <p className="text-gray-600 mt-2">{brandData?.description}</p>
                {brandData?.website && (
                  <a 
                    href={brandData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brandData?.products?.map((product) => {
            const stockInfo = getStockStatus(product.stock);
            const StockIcon = stockInfo.icon;

            return (
              <div
                key={product.productId}
                onClick={() => handleProductClick(product.productId)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-4">
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">{product.category}</p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {formatPrice(product.price)}
                      </div>
                      <div className={`flex items-center text-sm ${stockInfo.color}`}>
                        <StockIcon className="w-4 h-4 mr-1" />
                        {stockInfo.status}
                      </div>
                    </div>

                    {/* Key Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                      <div className="bg-gray-50 rounded-md p-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Key Specs:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applications */}
                    {product.applications && product.applications.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Applications:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.applications.slice(0, 2).map((app, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {app}
                            </span>
                          ))}
                          {product.applications.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{product.applications.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {brandData?.products?.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500">This brand doesn't have any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}