// "use client";
// import { useState, useEffect, useCallback } from 'react';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// export default function FilterSidebar({ onFilterChange, currentFilters, baseFilters }) {
//   // Initialize filters with both current and base filters
//   const [filters, setFilters] = useState({ ...baseFilters, ...currentFilters });
//   const [expandedSections, setExpandedSections] = useState({
//     brand: true,
//     manufacturer: true,
//     priceRange: true,
//     features: true,
//   });
//   const [availableFilters, setAvailableFilters] = useState({
//     brands: [],
//     manufacturers: [],
//     features: ['Low Power', 'High Speed', 'High Efficiency', 'Automotive', 'Industrial'],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Reset filters when baseFilters or currentFilters change
//   useEffect(() => {
//     setFilters({ ...baseFilters, ...currentFilters });
//   }, [baseFilters, currentFilters]);

//   // Fetch filter options on mount
//   useEffect(() => {
//     fetchFilterOptions();
//   }, []);

//   const fetchFilterOptions = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const brandsResponse = await fetch('/api/products/brands');
//       if (!brandsResponse.ok) {
//         throw new Error(`Failed to fetch brands: ${brandsResponse.status}`);
//       }
//       const brandsData = await brandsResponse.json();

//       const manufacturersResponse = await fetch('/api/products/manufacturers');
//       if (!manufacturersResponse.ok) {
//         throw new Error(`Failed to fetch manufacturers: ${manufacturersResponse.status}`);
//       }
//       const manufacturersData = await manufacturersResponse.json();

//       console.log('Brands data:', brandsData);
//       console.log('Manufacturers data:', manufacturersData);

//       setAvailableFilters({
//         brands: Array.isArray(brandsData.brands) ? brandsData.brands : [],
//         manufacturers: Array.isArray(manufacturersData.manufacturers) ? manufacturersData.manufacturers : [],
//         features: [
//           'Low Power',
//           'High Speed',
//           'High Efficiency',
//           'Automotive',
//           'Industrial',
//           'Temperature Stable',
//           'Fast Switching',
//           'High Reliability',
//         ],
//       });
//     } catch (error) {
//       console.error('Error fetching filter options:', error);
//       setError(error.message);
//       setAvailableFilters({
//         brands: [],
//         manufacturers: [],
//         features: ['Low Power', 'High Speed', 'High Efficiency', 'Automotive', 'Industrial'],
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Memoized function to apply filters
//   const applyFilters = useCallback(() => {
//     if (onFilterChange) {
//       const filtersToPass = { ...filters };
//       Object.keys(baseFilters || {}).forEach((key) => {
//         if (filtersToPass[key] === baseFilters[key]) {
//           delete filtersToPass[key];
//         }
//       });
//       onFilterChange(filtersToPass);
//     }
//   }, [filters, onFilterChange, baseFilters]);

//   const handleFilterChange = (filterType, value, checked) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev };

//       if (filterType === 'priceRange') {
//         if (value.min !== undefined) newFilters.minPrice = value.min;
//         if (value.max !== undefined) newFilters.maxPrice = value.max;
//       } else {
//         if (!newFilters[filterType]) {
//           newFilters[filterType] = [];
//         }

//         if (checked) {
//           newFilters[filterType] = [...newFilters[filterType], value];
//         } else {
//           newFilters[filterType] = newFilters[filterType].filter((item) => item !== value);
//         }

//         if (newFilters[filterType].length === 0) {
//           delete newFilters[filterType];
//         }
//       }

//       return newFilters;
//     });

//     // Call applyFilters after updating filters
//     applyFilters();
//   };

//   const clearFilters = () => {
//     setFilters({ ...baseFilters });
//     applyFilters();
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const FilterSection = ({ title, items, filterKey, isExpanded, onToggle }) => {
//     const itemsArray = Array.isArray(items) ? items : [];

//     return (
//       <div className="border-b border-gray-200 pb-4 mb-4">
//         <button
//           onClick={onToggle}
//           className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
//         >
//           {title}
//           {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
//         </button>

//         {isExpanded && (
//           <div className="space-y-2 max-h-48 overflow-y-auto">
//             {itemsArray.length > 0 ? (
//               itemsArray.map((item) => {
//                 const itemId =
//                   typeof item === 'object'
//                     ? item.displayName ||
//                       item.brandName ||
//                       item.manufacturerName ||
//                       item.brand ||
//                       item.manufacturer ||
//                       item._id
//                     : item;
//                 const itemName =
//                   typeof item === 'object'
//                     ? item.displayName ||
//                       item.brandName ||
//                       item.manufacturerName ||
//                       item.brand ||
//                       item.manufacturer ||
//                       item._id
//                     : item;
//                 const itemCount = typeof item === 'object' ? item.count : null;

//                 const isChecked = Array.isArray(filters[filterKey])
//                   ? filters[filterKey].includes(itemId)
//                   : filters[filterKey] === itemId;

//                 return (
//                   <label
//                     key={itemId}
//                     className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
//                   >
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       checked={isChecked}
//                       onChange={(e) => handleFilterChange(filterKey, itemId, e.target.checked)}
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       {itemName}
//                       {itemCount != null && (
//                         <span className="text-gray-500 ml-1">({itemCount})</span>
//                       )}
//                     </span>
//                   </label>
//                 );
//               })
//             ) : (
//               <p className="text-sm text-gray-500">No {title.toLowerCase()} available</p>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="animate-pulse">
//           <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-3 bg-gray-200 rounded"></div>
//             <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//             <div className="h-3 bg-gray-200 rounded w-4/6"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//         <button
//           onClick={clearFilters}
//           className="text-sm text-blue-600 hover:text-blue-800"
//         >
//           Clear All
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//           <p className="text-sm text-yellow-800">
//             Some filters may not be available. {error}
//           </p>
//         </div>
//       )}

//       {baseFilters && Object.keys(baseFilters).length > 0 && (
//         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//           <p className="text-sm text-blue-800">
//             Filtering by:{' '}
//             {Object.entries(baseFilters)
//               .map(([key, value]) => (
//                 <span key={key} className="font-medium capitalize">
//                   {key}: {value}
//                 </span>
//               ))
//               .join(', ')}
//           </p>
//         </div>
//       )}

//       {!baseFilters?.brand && (
//         <FilterSection
//           title="Brand"
//           items={availableFilters.brands}
//           filterKey="brand"
//           isExpanded={expandedSections.brand}
//           onToggle={() => toggleSection('brand')}
//         />
//       )}

//       {!baseFilters?.manufacturer && (
//         <FilterSection
//           title="Manufacturer"
//           items={availableFilters.manufacturers}
//           filterKey="manufacturer"
//           isExpanded={expandedSections.manufacturer}
//           onToggle={() => toggleSection('manufacturer')}
//         />
//       )}

//       <div className="border-b border-gray-200 pb-4 mb-4">
//         <button
//           onClick={() => toggleSection('priceRange')}
//           className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
//         >
//           Price Range
//           {expandedSections.priceRange ? <FiChevronUp /> : <FiChevronDown />}
//         </button>

//         {expandedSections.priceRange && (
//           <div className="space-y-3">
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.minPrice || ''}
//                 onChange={(e) =>
//                   handleFilterChange('priceRange', {
//                     min: e.target.value,
//                     max: filters.maxPrice,
//                   })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.maxPrice || ''}
//                 onChange={(e) =>
//                   handleFilterChange('priceRange', {
//                     min: filters.minPrice,
//                     max: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       <FilterSection
//         title="Features"
//         items={availableFilters.features}
//         filterKey="features"
//         isExpanded={expandedSections.features}
//         onToggle={() => toggleSection('features')}
//       />
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FilterSidebar({ onFilterChange, currentFilters, baseFilters }) {
  const [filters, setFilters] = useState({ ...baseFilters, ...currentFilters });
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    manufacturer: true,
    priceRange: true,
    features: true,
  });
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    manufacturers: [],
    features: ['Low Power', 'High Speed', 'High Efficiency', 'Automotive', 'Industrial'],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilters({ ...baseFilters, ...currentFilters });
  }, [baseFilters, currentFilters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const brandsResponse = await fetch('/api/products/brands');
      if (!brandsResponse.ok) {
        throw new Error(`Failed to fetch brands: ${brandsResponse.status}`);
      }
      const brandsData = await brandsResponse.json();

      const manufacturersResponse = await fetch('/api/products/manufacturers');
      if (!manufacturersResponse.ok) {
        throw new Error(`Failed to fetch manufacturers: ${manufacturersResponse.status}`);
      }
      const manufacturersData = await manufacturersResponse.json();

      console.log('Brands data:', brandsData);
      console.log('Manufacturers data:', manufacturersData);

      setAvailableFilters({
        brands: Array.isArray(brandsData.brands) ? brandsData.brands : [],
        manufacturers: Array.isArray(manufacturersData.manufacturers) ? manufacturersData.manufacturers : [],
        features: [
          'Low Power',
          'High Speed',
          'High Efficiency',
          'Automotive',
          'Industrial',
          'Temperature Stable',
          'Fast Switching',
          'High Reliability',
        ],
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError(error.message);
      setAvailableFilters({
        brands: [],
        manufacturers: [],
        features: ['Low Power', 'High Speed', 'High Efficiency', 'Automotive', 'Industrial'],
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    if (onFilterChange) {
      const filtersToPass = { ...filters };
      Object.keys(baseFilters || {}).forEach((key) => {
        if (JSON.stringify(filtersToPass[key]) === JSON.stringify(baseFilters[key])) {
          delete filtersToPass[key];
        }
      });
      onFilterChange(filtersToPass);
    }
  }, [filters, onFilterChange, baseFilters]);

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === 'priceRange') {
        if (value.min !== undefined) newFilters.minPrice = value.min ? Number(value.min) : undefined;
        if (value.max !== undefined) newFilters.maxPrice = value.max ? Number(value.max) : undefined;
      } else {
        if (!newFilters[filterType]) {
          newFilters[filterType] = [];
        }
        if (checked) {
          newFilters[filterType] = [...newFilters[filterType], value];
        } else {
          newFilters[filterType] = newFilters[filterType].filter((item) => item !== value);
        }
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      }

      return newFilters;
    });

    applyFilters();
  };

  const clearFilters = () => {
    setFilters({ ...baseFilters });
    applyFilters();
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({ title, items, filterKey, isExpanded, onToggle }) => {
    const itemsArray = Array.isArray(items) ? items : [];

    return (
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          {title}
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {isExpanded && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {itemsArray.length > 0 ? (
              itemsArray.map((item) => {
                const itemId = typeof item === 'object' ? item.displayName || item._id : item;
                const itemName = typeof item === 'object' ? item.displayName || item._id : item;
                const itemCount = typeof item === 'object' ? item.count : null;

                const isChecked = Array.isArray(filters[filterKey])
                  ? filters[filterKey].includes(itemId)
                  : filters[filterKey] === itemId;

                return (
                  <label
                    key={itemId}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={isChecked}
                      onChange={(e) => handleFilterChange(filterKey, itemId, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {itemName}
                      {itemCount != null && <span className="text-gray-500 ml-1">({itemCount})</span>}
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No {title.toLowerCase()} available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Some filters may not be available. {error}
          </p>
        </div>
      )}

      {baseFilters && Object.keys(baseFilters).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Filtering by:{' '}
            {Object.entries(baseFilters).map(([key, value]) => (
              <span key={key} className="font-medium capitalize">
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </span>
            ))}
          </p>
        </div>
      )}

      {!baseFilters?.brand && (
        <FilterSection
          title="Brand"
          items={availableFilters.brands}
          filterKey="brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        />
      )}

      {!baseFilters?.manufacturer && (
        <FilterSection
          title="Manufacturer"
          items={availableFilters.manufacturers}
          filterKey="manufacturer"
          isExpanded={expandedSections.manufacturer}
          onToggle={() => toggleSection('manufacturer')}
        />
      )}

      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('priceRange')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Price Range
          {expandedSections.priceRange ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.priceRange && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  handleFilterChange('priceRange', {
                    min: e.target.value,
                    max: filters.maxPrice,
                  })
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  handleFilterChange('priceRange', {
                    min: filters.minPrice,
                    max: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <FilterSection
        title="Features"
        items={availableFilters.features}
        filterKey="features"
        isExpanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      />
    </div>
  );
}