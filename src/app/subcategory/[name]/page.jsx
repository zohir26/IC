// app/subcategory/[name]/page.jsx
"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Eye,
  Package,
  Loader2,
  Clock,
  Cpu,
  Zap
} from 'lucide-react';

export default function SubCategoryProducts() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const subcategoryName = decodeURIComponent(params.name);
  const parentCategory = searchParams.get('category') || '';

  // Fetch products based on subcategory
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert subcategory name to match your data format exactly
      // "Microcontrollers" → "microcontrollers"
      const categoryParam = subcategoryName.toLowerCase().replace(/\s+/g, '-');
      
      const queryParams = new URLSearchParams({
        category: categoryParam,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy,
        order: sortOrder
      });

      // Add parent category if available
      if (parentCategory) {
        const parentParam = parentCategory.toLowerCase().replace(/\s+/g, '-');
        queryParams.append('parentCategory', parentParam);
      }

      // Add filters
      selectedBrands.forEach(brand => queryParams.append('brand', brand));
      selectedManufacturers.forEach(manufacturer => queryParams.append('manufacturer', manufacturer));
      
      if (priceRange.min) queryParams.append('minPrice', priceRange.min);
      if (priceRange.max) queryParams.append('maxPrice', priceRange.max);
      if (searchQuery) queryParams.append('search', searchQuery);

    //   console.log('=== FETCHING PRODUCTS ===');
    //   console.log('Original subcategory name:', subcategoryName);
    //   console.log('Converted category param:', categoryParam);
    //   console.log('Parent category:', parentCategory);
    //   console.log('Full API URL:', `/api/products?${queryParams.toString()}`);

      const response = await fetch(`/api/products?${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();

    //   console.log('=== API RESPONSE ===');
    //   console.log('Full response:', data);
    //   console.log('Products array:', data.products);
    //   console.log('Products count:', data.products?.length || 0);
    //   console.log('Pagination:', data.pagination);

      if (!data.success) {
        throw new Error(data.error || 'API returned unsuccessful response');
      }

      const products = data.products || [];
      console.log('Setting products:', products.length);
      
      if (products.length > 0) {
        // console.log('First product:', {
        //   name: products[0].name,
        //   category: products[0].category,
        //   brand: products[0].brand,
        //   brandName: products[0].brandName,
        //   image: products[0].image,
        //   price: products[0].price
        // });
      } else {
        console.log('No products found. Checking data...');
        // Let's also try without the category filter to see if we get any products
        const testResponse = await fetch('/api/products?limit=5');
        const testData = await testResponse.json();
        console.log('Test API call (no filters):', testData);
      }

      setProducts(products);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available brands and manufacturers for this subcategory
  const fetchFilters = async () => {
    try {
      const categoryParam = subcategoryName.toLowerCase().replace(/\s+/g, '-');
      const queryParams = new URLSearchParams({
        category: categoryParam
      });
      
      if (parentCategory) {
        queryParams.append('parentCategory', parentCategory.toLowerCase().replace(/\s+/g, '-'));
      }

      console.log('Fetching filters for category:', categoryParam);

      const response = await fetch(`/api/products/categories?${queryParams}`);
      
      if (!response.ok) {
        console.error('Filter API error:', response.status);
        return;
      }
      
      const data = await response.json();

      console.log('Filters API response:', data);
      
      if (data.success) {
        console.log('Filters received:', {
          brands: data.brands?.length || 0,
          manufacturers: data.manufacturers?.length || 0
        });
        setBrands(data.brands || []);
        setManufacturers(data.manufacturers || []);
      } else {
        console.error('Failed to fetch filters:', data.error);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedBrands, selectedManufacturers, priceRange.min, priceRange.max, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchFilters();
    fetchProducts(); // Also fetch products when subcategory changes
  }, [subcategoryName, parentCategory]);

  const handleBrandFilter = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleManufacturerFilter = (manufacturer) => {
    setSelectedManufacturers(prev => 
      prev.includes(manufacturer) 
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    );
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedManufacturers([]);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        {/* Product Image */}
        <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={product.image || '/api/placeholder/200/200'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTIwSDgwVjgwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Brand and Manufacturer */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Brand</span>
              <span className="text-sm font-medium text-gray-700">{product.brandName || product.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Mfg</span>
              <span className="text-sm text-gray-600">{product.manufacturerName || product.manufacturer}</span>
            </div>
          </div>

          {/* Type and Category */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.type}</span>
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">{product.category}</span>
          </div>

          {/* Key Specifications */}
          {product.specifications && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Key Specs:</h4>
              {product.specifications.architecture && (
                <div className="flex items-center gap-2 text-xs">
                  <Cpu className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">{product.specifications.architecture}</span>
                </div>
              )}
              {product.specifications.clockSpeed && (
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">{product.specifications.clockSpeed}</span>
                </div>
              )}
              {product.specifications.flashMemory && (
                <div className="flex items-center gap-2 text-xs">
                  <Package className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Flash: {product.specifications.flashMemory}</span>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-gray-500">+{product.features.length - 3} more</span>
              )}
            </div>
          )}

          {/* Price and Availability */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xl font-bold text-green-600">
              ${product.price ? product.price.toFixed(2) : 'Contact'}
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                product.availability === 'In Stock' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {product.availability || 'Check Stock'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3">
            <Link
              href={`/products/${product._id}`}
              className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
            <button
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <img 
            src={product.image || '/api/placeholder/80/80'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAzMkg0OFY0OEgzMlYzMloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=';
            }}
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2">
            {product.name}
          </h3>
          
          {/* Brand and Manufacturer Info */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-xs font-medium text-blue-600">Brand:</span>
              <p className="text-sm font-medium text-gray-700">{product.brandName || product.brand}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-green-600">Manufacturer:</span>
              <p className="text-sm text-gray-600">{product.manufacturerName || product.manufacturer}</p>
            </div>
          </div>

          {/* Type and Category */}
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.type}</span>
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">{product.category}</span>
          </div>

          {/* Key Specifications */}
          {product.specifications && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
              {product.specifications.architecture && (
                <div>Arch: {product.specifications.architecture}</div>
              )}
              {product.specifications.clockSpeed && (
                <div>Speed: {product.specifications.clockSpeed}</div>
              )}
              {product.specifications.flashMemory && (
                <div>Flash: {product.specifications.flashMemory}</div>
              )}
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 4).map((feature, index) => (
                <span key={index} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {product.features.length > 4 && (
                <span className="text-xs text-gray-500">+{product.features.length - 4}</span>
              )}
            </div>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xl font-bold text-green-600 mb-2">
            ${product.price ? product.price.toFixed(2) : 'Contact'}
          </div>
          <div className={`text-sm flex items-center gap-1 justify-end mb-4 ${
            product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              product.availability === 'In Stock' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {product.availability || 'Check Stock'}
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/products/${product._id}`}
              className="bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading {subcategoryName} products...</p>
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
            {parentCategory && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">{parentCategory}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{subcategoryName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{subcategoryName}</h1>
              <p className="text-gray-600">
                {pagination.totalCount || 0} products found
                {parentCategory && ` in ${parentCategory}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors rounded-l-lg`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors rounded-r-lg`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Options */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {(selectedBrands.length > 0 || selectedManufacturers.length > 0 || priceRange.min || priceRange.max) && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="Min"
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="Max"
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brands ({brands.length})
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {brands.map((brand) => (
                      <label key={brand._id.brand || brand._id.brandName} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.displayName)}
                          onChange={() => handleBrandFilter(brand.displayName)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {brand.displayName} ({brand.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Manufacturers */}
              {manufacturers.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturers ({manufacturers.length})
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {manufacturers.slice(0, 10).map((manufacturer) => (
                      <label key={manufacturer} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedManufacturers.includes(manufacturer)}
                          onChange={() => handleManufacturerFilter(manufacturer)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{manufacturer}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Content */}
          <div className="flex-1">
            {/* Debug Info (remove in production) */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>Subcategory: "{subcategoryName}"</div>
                  <div>Parent Category: "{parentCategory}"</div>
                  <div>Products Count: {products.length}</div>
                  <div>Brands Count: {brands.length}</div>
                  <div>Manufacturers Count: {manufacturers.length}</div>
                  <div>Loading: {loading.toString()}</div>
                  <div>Error: {error || 'None'}</div>
                </div>
              </div>
            )} */}

            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 && !loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  No {subcategoryName.toLowerCase()} products are available at the moment.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Products Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <ProductListItem key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center mt-12 gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 border rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h3>
                <p className="text-gray-600">
                  Fetching {subcategoryName.toLowerCase()} products...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}