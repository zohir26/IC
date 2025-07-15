"use client";
import { useState } from 'react';

export default function ComparisonTable({ products }) {
  const [activeTab, setActiveTab] = useState('specifications');

  if (!products || products.length === 0) {
    return null;
  }

  const renderSpecificationRow = (key, label) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">{label}</td>
      {products.map((product) => (
        <td key={product._id} className="px-6 py-4 text-gray-700">
          {product.specifications[key] || '-'}
        </td>
      ))}
    </tr>
  );

  const renderGeneralRow = (key, label, formatter = (val) => val) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">{label}</td>
      {products.map((product) => (
        <td key={product._id} className="px-6 py-4 text-gray-700">
          {formatter(product[key]) || '-'}
        </td>
      ))}
    </tr>
  );

  const renderArrayRow = (key, label) => (
    <tr key={key} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">{label}</td>
      {products.map((product) => (
        <td key={product._id} className="px-6 py-4 text-gray-700">
          {product[key] && product[key].length > 0 ? (
            <ul className="list-disc list-inside">
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
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Property
              </th>
              {products.map((product) => (
                <th key={product._id} className="px-6 py-4 text-left text-sm font-medium text-gray-900 min-w-48">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brandName}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'general' && (
              <>
                {renderGeneralRow('name', 'Product Name')}
                {renderGeneralRow('brandName', 'Brand')}
                {renderGeneralRow('category', 'Category')}
                {renderGeneralRow('type', 'Type')}
                {renderGeneralRow('price', 'Price', (price) => `$${price}`)}
                {renderGeneralRow('availability', 'Availability')}
                {renderGeneralRow('manufacturerName', 'Manufacturer')}
              </>
            )}
            
            {activeTab === 'specifications' && (
              <>
                {allSpecKeys.map((key) => 
                  renderSpecificationRow(key, key.charAt(0).toUpperCase() + key.slice(1))
                )}
              </>
            )}
            
            {activeTab === 'features' && (
              <>
                {renderArrayRow('features', 'Features')}
              </>
            )}
            
            {activeTab === 'applications' && (
              <>
                {renderArrayRow('applications', 'Applications')}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
