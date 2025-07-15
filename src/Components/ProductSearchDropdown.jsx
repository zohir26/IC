// Fixed ProductSearchDropdown.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function ProductSearchDropdown({ 
  placeholder, 
  onProductSelect, 
  selectedProduct,
  onClear 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Making search request for:', searchQuery); // Debug log
        
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}&limit=10`);
        
        console.log('Response status:', response.status); // Debug log
        console.log('Response headers:', response.headers); // Debug log
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        console.log('Search response data:', data); // Debug log
        
        setSearchResults(data.products || []);
      } catch (error) {
        console.error('Search error details:', {
          message: error.message,
          searchQuery: searchQuery,
          error: error
        });
        setSearchResults([]);
        
        // Optional: Show user-friendly error
        // alert('Search failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setSearchResults([]);
  };

  const handleClear = () => {
    onClear();
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {selectedProduct ? (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h4 className="font-semibold text-gray-800">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600">{selectedProduct.brandName}</p>
              <p className="text-sm text-blue-600">${selectedProduct.price}</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 pr-10"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      )}

      {isDropdownOpen && !selectedProduct && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product._id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
                onClick={() => handleProductSelect(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{product.brandName}</p>
                  <p className="text-sm text-blue-600">${product.price}</p>
                </div>
              </div>
            ))
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}