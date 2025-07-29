"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Package, DollarSign, CheckCircle, XCircle, ExternalLink, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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
      setError(null);
      
      console.log('🔍 Fetching brand:', brandName);
      const response = await fetch(`/api/brands/${brandName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch brand data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Received brand data:', data);
      console.log('📋 Products in data:', data.products?.length || 0);
      
      setBrandData(data);
      
      if (data.products && data.products.length > 0) {
        console.log('✅ Products loaded successfully');
        console.log('🔍 First product:', data.products[0]);
      } else {
        console.log('⚠️ No products found in brand data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching brand products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    // Use brandId if available, otherwise fall back to brandName
    const brandIdentifier = brandData?.brandId || brandName;
    router.push(`/brands/${brandIdentifier}/products/${productId}`);
  };

  const getStockStatus = (stock) => {
    if (stock > 1000) return { status: 'In Stock', color: 'text-green-600', icon: CheckCircle };
    if (stock > 0) return { status: 'Low Stock', color: 'text-yellow-600', icon: Package };
    return { status: 'Out of Stock', color: 'text-red-600', icon: XCircle };
  };

  const getRelatedProducts = (currentProduct, allProducts) => {
    // Use predefined related products if available
    if (currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0) {
      return allProducts.filter(product => 
        currentProduct.relatedProducts.includes(product.productId)
      );
    }
    
    // Fallback to dynamic matching
    return allProducts
      .filter(product => 
        product.productId !== currentProduct.productId && 
        (product.category === currentProduct.category || 
         product.type === currentProduct.type)
      )
      .slice(0, 4);
  };

  const getAlternativeProducts = (currentProduct) => {
    // Use predefined alternative products if available
    if (currentProduct.alternativeProducts && currentProduct.alternativeProducts.length > 0) {
      return currentProduct.alternativeProducts;
    }
    
    return [];
  };

  const ProductCard = ({ product, isRelated = false, isAlternative = false }) => {
    const stockInfo = getStockStatus(product.stock || 0);
    const StockIcon = stockInfo.icon;

    return (
      <div
        onClick={() => handleProductClick(product.productId)}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group ${
          isRelated ? 'border-l-4 border-l-blue-500' : ''
        } ${
          isAlternative ? 'border-l-4 border-l-orange-500' : ''
        }`}
      >
        <div className="p-4">
          {/* Badge for related/alternative */}
          {(isRelated || isAlternative) && (
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isRelated ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {isRelated ? 'Related' : 'Alternative'}
              </span>
            </div>
          )}

          {/* Product Image */}
          <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img 
              src={product.img || product.image || '/api/placeholder/300/200'} 
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
              {product.type && (
                <p className="text-xs text-gray-500">{product.type}</p>
              )}
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

            {/* Availability Status */}
            {product.availability && (
              <div className="flex items-center text-sm">
                <Package className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-gray-600">{product.availability}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading brand products...</p>
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

  if (!brandData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Not Found</h3>
            <p className="text-gray-500">The requested brand could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const products = brandData.products || [];
  const mainProducts = products.slice(0, 8); // Show first 8 as main products
  
  // Get all related products for all main products
  const allRelatedProducts = [];
  const allAlternativeProducts = [];
  
  products.forEach(product => {
    const related = getRelatedProducts(product, products);
    const alternatives = getAlternativeProducts(product);
    
    // Add related products (avoiding duplicates)
    related.forEach(relProd => {
      if (!allRelatedProducts.find(p => p.productId === relProd.productId)) {
        allRelatedProducts.push(relProd);
      }
    });
    
    // Add alternative products (avoiding duplicates)
    alternatives.forEach(altProd => {
      if (!allAlternativeProducts.find(p => p.productId === altProd.productId)) {
        allAlternativeProducts.push(altProd);
      }
    });
  });
  
  console.log('All related products:', allRelatedProducts);
  console.log('All alternative products:', allAlternativeProducts);

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
            <div className="flex items-center space-x-6">
              <img 
                src={brandData.logo || '/api/placeholder/80/80'} 
                alt={brandData.name}
                className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{brandData.name}</h1>
                <p className="text-gray-600 mb-4">{brandData.description}</p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {brandData.website && (
                    <a 
                      href={brandData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-1" />
                    {products.length} Products
                  </div>
                </div>

                {/* Specialties */}
                {brandData.specialties && brandData.specialties.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {brandData.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500">This brand doesn't have any products yet.</p>
          </div>
        ) : (
          <>
            {/* Main Products */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mainProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
              
              {products.length > 8 && (
                <div className="text-center mt-8">
                  <button 
                    onClick={() => {/* Implement load more or pagination */}}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All {products.length} Products
                  </button>
                </div>
              )}
            </div>

            {/* Related Products */}
            {allRelatedProducts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allRelatedProducts.slice(0, 8).map((product) => (
                    <ProductCard key={`related-${product.productId}`} product={product} isRelated={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Alternative Products */}
            {allAlternativeProducts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Package className="w-5 h-5 mr-2 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Alternative Products</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allAlternativeProducts.slice(0, 8).map((product) => (
                    <ProductCard key={`alt-${product.productId}`} product={product} isAlternative={true} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}