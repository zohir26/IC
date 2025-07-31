"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef([]);
  const router = useRouter();

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
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}&limit=8`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSearchResults(data.products || []);
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
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
    if (!isDropdownOpen || searchResults.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        // Navigate to general search page if Enter is pressed with query
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        handleClose();
      }
      return;
    }

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
        } else if (searchQuery.trim()) {
          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
          handleClose();
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  const handleProductSelect = (product) => {
    router.push(`/products/details/${product._id}`);
    handleClose();
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHighlightedIndex(-1);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price) => {
    if (price == null) return 'Price not available';
    return `$${Number(price).toFixed(2)}`;
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && resultsRef.current[highlightedIndex]) {
      resultsRef.current[highlightedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
          className="w-full px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg focus:bg-white focus:text-gray-900 focus:border-blue-500 focus:ring-0 placeholder-white/70 focus:placeholder-gray-400 text-white transition-all duration-200"
          aria-label="Search products"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <FiLoader className="w-4 h-4 animate-spin text-white/70" />
          )}
          {searchQuery && !isLoading && (
            <button
              onClick={handleClear}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <FiSearch className="w-4 h-4 text-white/70 pointer-events-none" />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden"
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <FiLoader className="w-5 h-5 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching products...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((product, index) => (
                  <div
                    key={product._id}
                    ref={el => resultsRef.current[index] = el}
                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center space-x-3 transition-colors ${
                      index === highlightedIndex 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleProductSelect(product)}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    tabIndex={-1}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={product.image || '/api/placeholder/50/50'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/50/50';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        {product.brandName && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {product.brandName}
                          </span>
                        )}
                        {product.category && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
                  </span>
                  {searchQuery.trim() && (
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={handleClose}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      View all results →
                    </Link>
                  )}
                </div>
              </div>
            </>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm mb-2">No products found for "{searchQuery}"</p>
              {searchQuery.trim() && (
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={handleClose}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Search in all products →
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}