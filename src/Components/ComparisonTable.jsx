"use client";
import { useState } from 'react';

export default function ComparisonTable({ products }) {
  const [activeTab, setActiveTab] = useState('specifications');

  if (!products || products.length === 0) {
    return null;
  }

  const getColumnWidth = () => {
    if (products.length === 3) return 'min-w-40';
    return 'min-w-48';
  };

  const renderSpecificationRow = (key, label) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">{label}</td>
      {products.map((product) => (
        <td key={product._id} className={`px-4 py-4 text-gray-700 ${getColumnWidth()}`}>
          {product.specifications?.[key] || '-'}
        </td>
      ))}
    </tr>
  );

  const renderGeneralRow = (key, label, formatter = (val) => val) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">{label}</td>
      {products.map((product) => (
        <td key={product._id} className={`px-4 py-4 text-gray-700 ${getColumnWidth()}`}>
          {formatter(product[key]) || '-'}
        </td>
      ))}
    </tr>
  );

  const renderArrayRow = (key, label) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">{label}</td>
      {products.map((product) => (
        <td key={product._id} className={`px-4 py-4 text-gray-700 ${getColumnWidth()}`}>
          {product[key] && product[key].length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {product[key].map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          ) : '-'}
        </td>
      ))}
    </tr>
  );

  // Get all unique specification keys
  const allSpecKeys = [...new Set(products.flatMap(p => Object.keys(p.specifications || {})))];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'general', label: 'General' },
            { id: 'specifications', label: 'Specifications' },
            { id: 'features', label: 'Features' },
            { id: 'applications', label: 'Applications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 sticky left-0 z-20 bg-gray-50">
                Property
              </th>
              {products.map((product, index) => (
                <th 
                  key={product._id} 
                  className={`px-4 py-4 text-left text-sm font-medium text-gray-900 ${getColumnWidth()}`}
                >
                  <div className="flex items-center space-x-2">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 object-contain flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate" title={product.name}>
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate" title={product.brandName}>
                        {product.brandName}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="tabpanel" id={`tabpanel-${activeTab}`}>
            {activeTab === 'general' && (
              <>
                {renderGeneralRow('name', 'Product Name')}
                {renderGeneralRow('brandName', 'Brand')}
                {renderGeneralRow('category', 'Category')}
                {renderGeneralRow('type', 'Type')}
                {renderGeneralRow('price', 'Price', (price) => price ? `$${price}` : '-')}
                {renderGeneralRow('availability', 'Availability')}
                {renderGeneralRow('manufacturerName', 'Manufacturer')}
                {renderGeneralRow('stock', 'Stock', (stock) => stock ? `${stock} units` : '-')}
              </>
            )}
            
            {activeTab === 'specifications' && (
              <>
                {allSpecKeys.length > 0 ? (
                  allSpecKeys.map((key) => 
                    renderSpecificationRow(key, key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
                  )
                ) : (
                  <tr>
                    <td colSpan={products.length + 1} className="px-4 py-8 text-center text-gray-500">
                      No specifications available for comparison
                    </td>
                  </tr>
                )}
              </>
            )}
            
            {activeTab === 'features' && (
              <>
                {renderArrayRow('features', 'Features')}
                {/* Add more feature-related rows if needed */}
              </>
            )}
            
            {activeTab === 'applications' && (
              <>
                {renderArrayRow('applications', 'Applications')}
                {/* Add more application-related rows if needed */}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly scroll indicator */}
      {products.length >= 3 && (
        <div className="md:hidden bg-gray-50 px-4 py-2 text-center">
          <p className="text-xs text-gray-500">
            ← Scroll horizontally to view all products →
          </p>
        </div>
      )}
    </div>
  );
}