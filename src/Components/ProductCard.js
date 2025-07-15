// // components/ProductCard.js - Fixed version with correct field mapping
// import Link from 'next/link';
// import { FiExternalLink, FiShoppingCart } from 'react-icons/fi';

// export default function ProductCard({ product }) {
//   // Helper function to safely format strings
//   const safeFormat = (str) => {
//     if (!str || typeof str !== 'string') return 'N/A';
//     return str.replace(/-/g, ' ');
//   };

//   // Helper function to safely get nested properties
//   const safeGet = (obj, path, defaultValue = 'N/A') => {
//     const keys = path.split('.');
//     let result = obj;
    
//     for (const key of keys) {
//       if (result == null || result[key] == null) {
//         return defaultValue;
//       }
//       result = result[key];
//     }
    
//     return result;
//   };

//   // Validate required product data
//   if (!product || !product._id) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <p className="text-gray-500">Invalid product data</p>
//       </div>
//     );
//   }

//   // Map fields to ensure consistency with your database schema
//   const productName = product.productCode || product.name || 'Unnamed Product';
//   const brandDisplay = product.brandName || product.brand || 'Unknown Brand';
//   const manufacturerDisplay = product.manufacturerName || product.manufacturer || 'Unknown';
//   const price = product.unitPrice || product.price;

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
//       <div className="p-6">
//         {/* Product Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               {productName}
//             </h3>
//             <p className="text-sm text-blue-600 font-medium">
//               {brandDisplay}
//             </p>
//           </div>
//           {product.image && (
//             <img 
//               src={product.image} 
//               alt={productName}
//               className="w-12 h-12 object-contain"
//             />
//           )}
//         </div>

//         {/* Product Type & Category */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {product.category && (
//             <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
//               {safeFormat(product.category)}
//             </span>
//           )}
//           {product.type && (
//             <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
//               {safeFormat(product.type)}
//             </span>
//           )}
//         </div>

//         {/* Description if available */}
//         {product.description && (
//           <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//             {product.description}
//           </p>
//         )}

//         {/* Key Specifications */}
//         {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
//           <div className="mb-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">Key Specs:</h4>
//             <div className="space-y-1">
//               {Object.entries(product.specifications)
//                 .slice(0, 3)
//                 .map(([key, value]) => (
//                   <div key={key} className="flex justify-between text-xs">
//                     <span className="text-gray-500 capitalize">
//                       {key.replace(/([A-Z])/g, ' $1').trim()}:
//                     </span>
//                     <span className="text-gray-700 font-medium">
//                       {Array.isArray(value) 
//                         ? value.join(', ') 
//                         : (value != null ? String(value) : 'N/A')
//                       }
//                     </span>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Features */}
//         {product.features && Array.isArray(product.features) && product.features.length > 0 && (
//           <div className="mb-4">
//             <div className="flex flex-wrap gap-1">
//               {product.features.slice(0, 3).map((feature, index) => (
//                 <span 
//                   key={index}
//                   className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
//                 >
//                   {feature}
//                 </span>
//               ))}
//               {product.features.length > 3 && (
//                 <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
//                   +{product.features.length - 3} more
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Price & Availability */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             {price != null && (
//               <p className="text-lg font-bold text-gray-900">
//                 ${Number(price).toFixed(2)}
//               </p>
//             )}
//             {product.moq && (
//               <p className="text-xs text-gray-500">MOQ: {product.moq}</p>
//             )}
//             <p className={`text-sm ${
//               product.availability === 'In Stock' || product.isActive !== false
//                 ? 'text-green-600' 
//                 : 'text-red-600'
//             }`}>
//               {product.availability || (product.isActive !== false ? 'Available' : 'Unavailable')}
//             </p>
//           </div>
//           <div className="text-xs text-gray-500">
//             <p>Mfg: {manufacturerDisplay}</p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2">
//           <Link 
//             href={`/products/details/${product._id}`}
//             className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
//           >
//             View Details
//           </Link>
//           {product.datasheet && (
//             <a 
//               href={product.datasheet}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               title="View Datasheet"
//             >
//               <FiExternalLink className="w-4 h-4 text-gray-600" />
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const safeFormat = (str) => {
    if (!str || typeof str !== 'string') return 'N/A';
    return str.replace(/-/g, ' ');
  };

  if (!product || !product._id) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Invalid product data</p>
      </div>
    );
  }

  const productName = product.name || 'Unnamed Product';
  const brandDisplay = product.brandName || product.brand || 'Unknown Brand';
  const manufacturerDisplay = product.manufacturerName || product.manufacturer || 'Unknown';
  const price = product.price;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{productName}</h3>
            <p className="text-sm text-blue-600 font-medium">{brandDisplay}</p>
          </div>
          {product.image && (
            <img
              src={product.image}
              alt={productName}
              className="w-12 h-12 object-contain"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
              {safeFormat(product.category)}
            </span>
          )}
          {product.type && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
              {safeFormat(product.type)}
            </span>
          )}
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Specs:</h4>
            <div className="space-y-1">
              {Object.entries(product.specifications)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-700 font-medium">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {product.features && Array.isArray(product.features) && product.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{product.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            {price != null && (
              <p className="text-lg font-bold text-gray-900">${Number(price).toFixed(2)}</p>
            )}
            <p
              className={`text-sm ${
                product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.availability}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Mfg: {manufacturerDisplay}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/details/${product._id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          {product.datasheet && (
            <a
              href={product.datasheet}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View Datasheet"
            >
              <FiExternalLink className="w-4 h-4 text-gray-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}