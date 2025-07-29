// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   ArrowLeft,
//   Loader2,
//   AlertCircle,
//   Upload,
//   FileText,
//   Download,
//   Trash2,
//   DollarSign,
//   Package,
//   CheckCircle,
//   XCircle,
//   ExternalLink,
//   Plus,
//   BarChart3,
//   Star,
//   Zap
// } from 'lucide-react';
// import { api, formatPrice } from '@/lib/utils';

// export default function ProductDetail({ brandName, productId }) {
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [alternativeProducts, setAlternativeProducts] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     if (brandName && productId) {
//       fetchProductDetails();
//       fetchDocuments();
//     }
//   }, [brandName, productId]);

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true);
//       const data = await api.get(`/api/brands/${brandName}/products/${productId}`);

//       console.log('API Response:', data); // Debug log

//       setProduct(data.product);
//       setRelatedProducts(data.relatedProducts || []);

//       // Handle alternative products - check multiple possible response structures
//       if (data.alternativeProducts) {
//         setAlternativeProducts(data.alternativeProducts);
//       } else if (data.product?.alternativeProducts) {
//         setAlternativeProducts(data.product.alternativeProducts);
//       } else {
//         // If no alternative products in API response, set empty array
//         setAlternativeProducts([]);
//         console.log('No alternative products found in API response');
//       }

//     } catch (err) {
//       console.error('Error fetching product details:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDocuments = async () => {
//     try {
//       const docs = await api.get(`/api/products/${productId}/documents`);
//       setDocuments(docs);
//     } catch (err) {
//       console.error('Error fetching documents:', err);
//     }
//   };

//   const getStockStatus = (stock) => {
//     if (stock > 1000) return { status: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
//     if (stock > 0) return { status: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Package };
//     return { status: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
//   };

//   const renderProductCard = (productItem, isAlternative = false) => {
//     const stockInfo = getStockStatus(productItem.stock);
//     const StockIcon = stockInfo.icon;

//     return (
//       <div
//         key={productItem.productId}
//         onClick={() => {
//           if (isAlternative && productItem.brandName) {
//             router.push(`/brands/${productItem.brandName}/products/${productItem.productId}`);
//           } else {
//             router.push(`/brands/${brandName}/products/${productItem.productId}`);
//           }
//         }}
//         className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group relative"
//       >
//         {isAlternative && (
//           <div className="absolute top-2 right-2">
//             <Zap className="w-4 h-4 text-orange-500" title="Alternative Product" />
//           </div>
//         )}

//         <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
//           <img
//             src={productItem.image}
//             alt={productItem.name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//           />
//         </div>

//         <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
//           {productItem.name}
//         </h3>

//         {isAlternative && productItem.brandName && (
//           <p className="text-xs text-gray-500 mb-1">by {productItem.brandName}</p>
//         )}

//         <p className="text-sm text-blue-600 font-medium mb-2">{productItem.category}</p>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center text-sm font-bold text-gray-900">
//             <DollarSign className="w-3 h-3" />
//             {formatPrice(productItem.price)}
//           </div>
//           <div className={`flex items-center text-xs ${stockInfo.color}`}>
//             <StockIcon className="w-3 h-3 mr-1" />
//             {stockInfo.status}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center">
//               <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
//               <p className="text-gray-600">Loading product details...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center">
//               <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Product</h3>
//               <p className="text-gray-600 mb-4">{error}</p>
//               <button
//                 onClick={fetchProductDetails}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const stockInfo = getStockStatus(product?.stock || 0);
//   const StockIcon = stockInfo.icon;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.push(`/brands/${brandName}`)}
//             className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to {brandName} Products
//           </button>
//         </div>

//         {/* Product Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           {/* Product Image */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="w-full h-96 bg-gray-100 rounded-lg mb-4 overflow-hidden">
//               <img
//                 src={product?.image}
//                 alt={product?.name}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//             <div className="flex space-x-3">
//               {product?.datasheet && (
//                 <a
//                   href={`/datasheets/${product.datasheet}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   Download Datasheet
//                 </a>
//               )}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="mb-6">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
//               <p className="text-lg text-blue-600 font-medium mb-2">{product?.category}</p>
//               <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
//                 <StockIcon className="w-4 h-4 mr-1" />
//                 {stockInfo.status} ({product?.stock} units)
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center text-3xl font-bold text-gray-900 mb-2">
//                 <DollarSign className="w-6 h-6" />
//                 {formatPrice(product?.price || 0)}
//               </div>
//               <p className="text-gray-600">{product?.description}</p>
//             </div>

//             {/* Specifications */}
//             {product?.specifications && Object.keys(product.specifications).length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="grid grid-cols-1 gap-2">
//                     {Object.entries(product.specifications).map(([key, value]) => (
//                       <div key={key} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
//                         <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                         <span className="font-medium text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features */}
//             {product?.features && product.features.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.features.map((feature, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
//                     >
//                       {feature}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Applications */}
//             {product?.applications && product.applications.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Applications</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.applications.map((app, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
//                     >
//                       {app}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Debug Information - Remove this in production */}
//         {/* {process.env.NODE_ENV === 'development' && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
//             <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
//             <div className="text-sm text-yellow-700">
//               <p>Product ID: {productId}</p>
//               <p>Brand Name: {brandName}</p>
//               <p>Alternative Products Count: {alternativeProducts.length}</p>
//               <p>Related Products Count: {relatedProducts.length}</p>
//               {alternativeProducts.length === 0 && (
//                 <p className="text-red-600 font-medium">
//                   ⚠️ No alternative products found. Check API response structure.
//                 </p>
//               )}
//             </div>
//           </div>
//         )} */}

//         {/* Related Products */}
//         {relatedProducts.length > 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center mb-6">
//               <Star className="w-6 h-6 text-blue-500 mr-2" />
//               <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Other products from {brandName} that complement this product
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {relatedProducts.map((relatedProduct) =>
//                 renderProductCard(relatedProduct, false)
//               )}
//             </div>
//           </div>
//         ) : (
//           // Show message when no related products are available
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center mb-6">
//               <Star className="w-6 h-6 text-blue-500 mr-2" />
//               <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
//             </div>
//             <div className="text-center py-8">
//               <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No related products available from {brandName}.</p>
//             </div>
//           </div>
//         )}
//         {/* Alternative Products */}
//         {alternativeProducts.length > 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
//             <div className="flex items-center mb-6">
//               <Zap className="w-6 h-6 text-orange-500 mr-2" />
//               <h2 className="text-2xl font-bold text-gray-900">Alternative Products</h2>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Similar products from other manufacturers that may serve as alternatives
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {alternativeProducts.map((alternativeProduct) =>
//                 renderProductCard(alternativeProduct, true)
//               )}
//             </div>
//           </div>
//         ) : (
//           // Show message when no alternative products are available
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
//             <div className="flex items-center mb-6">
//               <Zap className="w-6 h-6 text-orange-500 mr-2" />
//               <h2 className="text-2xl font-bold text-gray-900">Alternative Products</h2>
//             </div>
//             <div className="text-center py-8">
//               <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No alternative products available for this item.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Package, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Download,
  Share2,
  Heart,
  ShoppingCart,
  Zap,
  Info
} from 'lucide-react';
import { formatPrice, getRelatedProducts, getAlternativeProducts } from '@/lib/utils';

export default function ProductDetail({ brandName, productId }) {
  const [brandData, setBrandData] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [alternativeProducts, setAlternativeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    if (brandName && productId) {
      fetchProductData();
    }
  }, [brandName, productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch brand data which contains all products
      const response = await fetch(`/api/brands/${brandName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch brand data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBrandData(data);
      
      // Find the specific product
      const foundProduct = data.products?.find(p => 
        p.productId?.toString() === productId.toString()
      );
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }
      
      setProduct(foundProduct);
      
      // Get related and alternative products
      if (data.products) {
        // Use predefined related products
        let related = [];
        if (foundProduct.relatedProducts && foundProduct.relatedProducts.length > 0) {
          related = data.products.filter(p => 
            foundProduct.relatedProducts.includes(p.productId)
          );
        }
        
        // Use predefined alternative products
        let alternatives = [];
        if (foundProduct.alternativeProducts && foundProduct.alternativeProducts.length > 0) {
          alternatives = foundProduct.alternativeProducts;
        }
        
        setRelatedProducts(related);
        setAlternativeProducts(alternatives);
        
        console.log('Related products found:', related.length);
        console.log('Alternative products found:', alternatives.length);
      }
      
    } catch (err) {
      console.error('Error fetching product data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 1000) return { status: 'In Stock', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    if (stock > 0) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-50', icon: Package };
    return { status: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: XCircle };
  };

  const handleProductClick = (newProductId) => {
    router.push(`/brands/${brandName}/products/${newProductId}`);
  };

  const ProductCard = ({ product, isRelated = false, isAlternative = false }) => {
    const stockInfo = getStockStatus(product.stock || 0);
    const StockIcon = stockInfo.icon;

    const handleClick = () => {
      if (isAlternative && product.brandName) {
        // For alternative products from different brands, navigate to their brand page
        const brandSlug = product.brandName.toLowerCase().replace(/\s+/g, '-');
        router.push(`/brands/${brandSlug}/products/${product.productId}`);
      } else {
        // For related products or same brand, stay in current brand
        handleProductClick(product.productId);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group ${
          isRelated ? 'border-l-4 border-l-blue-500' : ''
        } ${
          isAlternative ? 'border-l-4 border-l-orange-500' : ''
        }`}
      >
        <div className="p-4">
          {(isRelated || isAlternative) && (
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isRelated ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {isRelated ? 'Related' : 'Alternative'}
              </span>
              {/* Show brand name for alternative products */}
              {isAlternative && product.brandName && (
                <span className="text-xs text-gray-500 font-medium">{product.brandName}</span>
              )}
            </div>
          )}

          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
            <img 
              src={product.img || product.image || '/api/placeholder/200/150'} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-blue-600 font-medium">{product.category}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-bold text-gray-900">
                <DollarSign className="w-3 h-3" />
                {formatPrice(product.price)}
              </div>
              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${stockInfo.color}`}>
                <StockIcon className="w-3 h-3 mr-1" />
                {stockInfo.status}
              </div>
            </div>
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
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => router.push(`/brands/${brandName}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stockInfo = getStockStatus(product.stock || 0);
  const StockIcon = stockInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/brands')}
            className="hover:text-blue-600 transition-colors"
          >
            Brands
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={() => router.push(`/brands/${brandName}`)}
            className="hover:text-blue-600 transition-colors"
          >
            {brandData?.name}
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push(`/brands/${brandName}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {brandData?.name} Products
        </button>

        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={product.img || product.image || '/api/placeholder/400/400'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={brandData?.logo || '/api/placeholder/40/40'} 
                    alt={brandData?.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-blue-600 font-medium">{brandData?.name}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600">{product.description}</p>
              </div>

              {/* Category and Type */}
              <div className="flex gap-4">
                {product.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
                {product.type && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {product.type}
                  </span>
                )}
              </div>

              {/* Price and Stock */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-3xl font-bold text-gray-900">
                    <DollarSign className="w-6 h-6" />
                    {formatPrice(product.price)}
                  </div>
                  <div className={`flex items-center px-4 py-2 rounded-full ${stockInfo.color}`}>
                    <StockIcon className="w-4 h-4 mr-2" />
                    {stockInfo.status}
                  </div>
                </div>
              </div>

              {/* Availability */}
              {product.availability && (
                <div className="flex items-center text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>{product.availability}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'specifications', 'applications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No detailed description available for this product.'}
                </p>
                {product.productId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Product ID:</strong> {product.productId}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700 capitalize">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                {product.applications && product.applications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.applications.map((app, index) => (
                      <div key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center">
                        {app}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specific applications listed for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={`related-${relatedProduct.productId}`} product={relatedProduct} isRelated={true} />
              ))}
            </div>
          </div>
        )}

        {/* Alternative Products */}
        {alternativeProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Alternative Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {alternativeProducts.map((altProduct) => (
                <ProductCard key={`alt-${altProduct.productId}`} product={altProduct} isAlternative={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}