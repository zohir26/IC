"use client";
import { useState } from 'react';
import ProductSearchDropdown from './ProductSearchDropdown';
import ComparisonTable from './ComparisonTable';

export default function CompareSection() {
  const [selectedProducts, setSelectedProducts] = useState([null, null]);
  const [comparisonData, setComparisonData] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleProductSelect = (index, product) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = product;
    setSelectedProducts(newSelectedProducts);
  };

  const handleClearProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = null;
    setSelectedProducts(newSelectedProducts);
    
    // Clear comparison if one product is removed
    if (comparisonData.length > 0) {
      setComparisonData([]);
      setIsComparing(false);
    }
  };

  const handleCompare = async () => {
    const validProducts = selectedProducts.filter(p => p !== null);
    
    if (validProducts.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }

    setIsComparing(true);
    
    try {
      const response = await fetch('/api/products/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: validProducts.map(p => p._id)
        }),
      });
      
      const data = await response.json();
      setComparisonData(data.products || []);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Error comparing products. Please try again.');
    } finally {
      setIsComparing(false);
    }
  };

  const clearAll = () => {
    setSelectedProducts([null, null]);
    setComparisonData([]);
    setIsComparing(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">COMPARE PRODUCTS</h2>
          </div>
        </div>

        {/* Compare Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
          {/* First Compare Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">PRODUCT 1</h3>
            <ProductSearchDropdown
              placeholder="Search for first product..."
              onProductSelect={(product) => handleProductSelect(0, product)}
              selectedProduct={selectedProducts[0]}
              onClear={() => handleClearProduct(0)}
            />
          </div>

          {/* Second Compare Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">PRODUCT 2</h3>
            <ProductSearchDropdown
              placeholder="Search for second product..."
              onProductSelect={(product) => handleProductSelect(1, product)}
              selectedProduct={selectedProducts[1]}
              onClear={() => handleClearProduct(1)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleCompare}
            disabled={isComparing || selectedProducts.filter(p => p !== null).length < 2}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isComparing ? 'Comparing...' : 'Compare Products'}
          </button>
          
          {(selectedProducts.some(p => p !== null) || comparisonData.length > 0) && (
            <button
              onClick={clearAll}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Comparison Video Section */}
{comparisonData.length > 0 && (
  <div className="max-w-6xl mx-auto mb-8">
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Comparison Videos</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {comparisonData.slice(0, 2).map((product, index) => (
          <div key={product._id || product.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {product.videoUrl ? (
              <iframe
                src={product.videoUrl}
                title={`${product.name} Overview`}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">No video available</p>
                  <p className="text-xs text-gray-500">{product.name}</p>
                </div>
              </div>
            )}
            <div className="p-3 bg-white">
              <h4 className="font-semibold text-sm">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.brandName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        {/* Comparison Table */}
        {comparisonData.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <ComparisonTable products={comparisonData} />
          </div>
        )}
      </div>
    </section>
  );
}

// Example usage in a page (pages/compare.js or app/compare/page.js)
// import CompareSection from '../components/CompareSection';

// export default function ComparePage() {
//   return (
//     <div>
//       <CompareSection />
//     </div>
//   );
// }