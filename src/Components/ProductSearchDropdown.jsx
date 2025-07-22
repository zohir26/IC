"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function ProductSearchDropdown({ 
  placeholder, 
  onProductSelect, 
  selectedProduct,
  onClear,
  ariaLabel
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setHighlightedIndex(-1);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Making search request for:', searchQuery);
        
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}&limit=10`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        console.log('Search response data:', data);
        
        setSearchResults(data.products || []);
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Search error details:', {
          message: error.message,
          searchQuery: searchQuery,
          error: error
        });
        setSearchResults([]);
        setHighlightedIndex(-1);
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
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleProductSelect(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && resultsRef.current[highlightedIndex]) {
      resultsRef.current[highlightedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setSearchResults([]);
    setHighlightedIndex(-1);
    
    // Announce selection to screen readers
    const announcement = `Selected ${product.name} from ${product.brandName}`;
    announceToScreenReader(announcement);
  };

  const handleClear = () => {
    onClear();
    setSearchQuery('');
    setSearchResults([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
    
    // Announce clearing to screen readers
    announceToScreenReader('Product selection cleared');
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
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
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            aria-label={`Clear ${selectedProduct.name} selection`}
            title="Clear selection"
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 pr-10"
            aria-label={ariaLabel || placeholder}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            role="combobox"
            aria-owns={isDropdownOpen ? 'search-results' : undefined}
            aria-activedescendant={
              highlightedIndex >= 0 ? `result-${highlightedIndex}` : undefined
            }
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      )}

      {isDropdownOpen && !selectedProduct && (
        <div 
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product, index) => (
              <div
                key={product._id}
                ref={el => resultsRef.current[index] = el}
                id={`result-${index}`}
                className={`p-3 cursor-pointer border-b last:border-b-0 flex items-center space-x-3 transition-colors ${
                  index === highlightedIndex 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleProductSelect(product)}
                role="option"
                aria-selected={index === highlightedIndex}
                tabIndex={-1}
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
            <div className="p-4 text-center text-gray-500" role="status">
              No products found for "{searchQuery}"
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500" role="status">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}

      {/* Screen reader only status region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {isDropdownOpen && !isLoading && searchResults.length > 0 && (
          `${searchResults.length} products found`
        )}
      </div>
    </div>
  );
}