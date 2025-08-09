// "use client";
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useParams } from 'next/navigation';
// import ProductCard from '../../../Components/ProductCard';
// import FilterSidebar from '../../../Components/FilterSidebar';
// import Pagination from '../../../Components/Pagination';

// export default function ProductsPage() {
//   const params = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({});
//   // This state holds filters applied by the user in the FilterSidebar.
//   const [filters, setFilters] = useState({});

//   // Parse the URL slug to determine the base filter (e.g., a specific category or brand).
//   // This is memoized to avoid recalculation on every render.
//   const baseFilters = useMemo(() => {
//     const slugParts = params.slug || [];
//     if (slugParts.length < 2) return {};
    
//     const filterKey = slugParts[0];
//     const filterValue = slugParts[1];
    
//     switch(filterKey) {
//       case 'category':
//         return { category: filterValue };
//       case 'brand':
//         return { brand: filterValue };
//       case 'manufacturer':
//         return { manufacturer: filterValue };
//       case 'type':
//         return { type: filterValue };
//       default:
//         return {};
//     }
//   }, [params.slug]);

//   // The main data fetching function. It's wrapped in useCallback for optimization.
//   const fetchProducts = useCallback(async (filterParams) => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();

//       // Append all filter values to the query string.
//       // This correctly handles arrays for multi-select filters.
//       Object.entries(filterParams).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           value.forEach(item => queryParams.append(key, item));
//         } else if (value) {
//           queryParams.append(key, value);
//         }
//       });

//       console.log('Fetching with params:', queryParams.toString());

//       const response = await fetch(`/api/products?${queryParams.toString()}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch products: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setProducts(data.products || []);
//       setPagination(data.pagination || {});
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setProducts([]);
//       setPagination({});
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // *** MAJOR FIX ***
//   // This is now the single source of truth for triggering data fetches.
//   // It runs whenever the base URL filter changes (navigation) or when sidebar filters change.
//   useEffect(() => {
//     // We combine the base filter from the URL with the interactive filters from the sidebar.
//     const allFilters = { ...baseFilters, ...filters };
//     fetchProducts(allFilters);
//   }, [baseFilters, filters, fetchProducts]); // Depends on both filter sources

//   // This handler is called by the FilterSidebar when the user changes a filter.
//   const handleFilterChange = useCallback((newFilters) => {
//     // We update the filters state and reset to page 1.
//     // This triggers the main useEffect hook to re-fetch data.
//     setFilters({ ...newFilters, page: 1 });
//   }, []);

//   // This handler is for the Pagination component.
//   const handlePageChange = useCallback((newPage) => {
//     // We only update the page number in the filters state.
//     // This also triggers the main useEffect hook.
//     setFilters(prev => ({ ...prev, page: newPage }));
//   }, []);

//   // Memoized page title based on the URL slug.
//   const pageTitle = useMemo(() => {
//     const slugParts = params.slug || [];
//     if (slugParts.length < 2) return "All Products";
    
//     const filterType = slugParts[0];
//     const filterValue = slugParts[1];
    
//     const formattedValue = filterValue.replace(/-/g, ' ');
//     return `${formattedValue} ${filterType === 'category' ? '' : filterType}`.trim();
//   }, [params.slug]);

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 capitalize">
//             {pageTitle}
//           </h1>
//           {!loading && (
//             <p className="text-gray-600 mt-2">
//               {pagination.totalCount ?? 0} products found
//             </p>
//           )}
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="w-full lg:w-64 flex-shrink-0">
//             <FilterSidebar 
//               key={JSON.stringify(baseFilters)}
//               onFilterChange={handleFilterChange}
//               currentFilters={filters}
//               baseFilters={baseFilters}
//             />
//           </div>

//           <div className="flex-1">
//             {loading ? (
//               <div className="text-center py-12">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                 <p className="mt-2 text-gray-600">Loading products...</p>
//               </div>
//             ) : products.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {products.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {pagination.totalPages > 1 && (
//                   <Pagination 
//                     pagination={pagination}
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../Components/ProductCard';
import FilterSidebar from '../../../Components/FilterSidebar';
import Pagination from '../../../Components/Pagination';

export default function ProductsPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});

const baseFilters = useMemo(() => {
  const slugParts = params.slug || [];
  if (slugParts.length < 2) return {};

  const filterKey = slugParts[0];
  const filterValue = slugParts[1];

  switch (filterKey) {
    case 'category':
      return { category: filterValue };
    case 'brand':
      return { brandName: filterValue }; // Changed from brand: [filterValue]
    case 'manufacturer':
      return { manufacturerName: filterValue }; // Changed from manufacturer: [filterValue]
    case 'type':
      return { type: filterValue };
    default:
      return {};
  }
}, [params.slug]);

//   const baseFilters = useMemo(() => {
//   const slugParts = params.slug || [];
//   if (slugParts.length < 2) return {};

//   const filterKey = slugParts[0];
//   const filterValue = slugParts[1];

//   switch (filterKey) {
//     case 'category':
//       return { category: filterValue };
//       case 'subcategory': // Add subcategory case
//       return { category: filterValue };
//     case 'brand':
//       return { brand: filterValue }; // Changed from brand to brandName
//     case 'manufacturer':
//       return { manufacturerName: filterValue }; // Changed from manufacturer to manufacturerName
//     case 'type':
//       return { type: filterValue };
//     default:
//       return {};
//   }
// }, [params.slug]);
  const fetchProducts = useCallback(async (filterParams) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item));
        } else if (value) {
          queryParams.append(key, value);
        }
      });

      console.log('Fetching with params:', queryParams.toString());

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const allFilters = { ...baseFilters, ...filters };
    fetchProducts(allFilters);
  }, [baseFilters, filters, fetchProducts]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const pageTitle = useMemo(() => {
    const slugParts = params.slug || [];
    if (slugParts.length < 2) return 'All Products';

    const filterType = slugParts[0];
    const filterValue = slugParts[1];
    const formattedValue = filterValue.replace(/-/g, ' ');
    return `${formattedValue} ${filterType === 'category' ? '' : filterType}`.trim();
  }, [params.slug]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{pageTitle}</h1>
          {!loading && (
            <p className="text-gray-600 mt-2">{pagination.totalCount ?? 0} products found</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              key={JSON.stringify(baseFilters)}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              baseFilters={baseFilters}
            />
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <Pagination pagination={pagination} onPageChange={handlePageChange} />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// app/products/[...slug]/page.js
// "use client";
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useParams, useSearchParams } from 'next/navigation'; // <-- Import useSearchParams
// import ProductCard from '../../../Components/ProductCard';
// import FilterSidebar from '../../../Components/FilterSidebar';
// import Pagination from '../../../Components/Pagination';

// export default function ProductsPage() {
//   const params = useParams();
//   const searchParams = useSearchParams(); // <-- Use useSearchParams for sort/page
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({});
//   const [filters, setFilters] = useState({});

//   const baseFilters = useMemo(() => {
//     const slugParts = params.slug || [];
//     if (slugParts.length < 2) return {};
    
//     const filterKey = slugParts[0];
//     const filterValue = slugParts[1];
    
//     switch(filterKey) {
//       case 'category':
//         return { category: filterValue };
//       case 'brand':
//         return { brand: filterValue };
//       case 'manufacturer':
//         return { manufacturer: filterValue };
//       case 'type':
//         return { type: filterValue };
//       default:
//         return {};
//     }
//   }, [params.slug]);

//   const fetchProducts = useCallback(async (filterParams) => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();

//       Object.entries(filterParams).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           value.forEach(item => queryParams.append(key, item));
//         } else if (value) {
//           queryParams.append(key, value);
//         }
//       });
      
//       console.log('Fetching with params:', queryParams.toString());

//       const response = await fetch(`/api/products?${queryParams.toString()}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch products: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setProducts(data.products || []);
//       setPagination(data.pagination || {});
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setProducts([]);
//       setPagination({});
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const allFilters = { ...baseFilters, ...filters };
//     fetchProducts(allFilters);
//   }, [baseFilters, filters, fetchProducts]);

//   const handleFilterChange = useCallback((newFilters) => {
//     setFilters({ ...newFilters, page: 1 });
//   }, []);

//   const handlePageChange = useCallback((newPage) => {
//     setFilters(prev => ({ ...prev, page: newPage }));
//   }, []);

//   const pageTitle = useMemo(() => {
//     const slugParts = params.slug || [];
//     if (slugParts.length < 2) return "All Products";
    
//     const filterType = slugParts[0];
//     const filterValue = slugParts[1];
    
//     const formattedValue = filterValue.replace(/-/g, ' ');
//     return `${formattedValue} ${filterType === 'category' ? 'Products' : filterType}`.trim();
//   }, [params.slug]);

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 capitalize">
//             {pageTitle}
//           </h1>
//           {!loading && (
//             <p className="text-gray-600 mt-2">
//               {pagination.totalCount ?? 0} products found
//             </p>
//           )}
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="w-full lg:w-64 flex-shrink-0">
//             <FilterSidebar 
//               onFilterChange={handleFilterChange}
//               currentFilters={filters}
//               baseFilters={baseFilters}
//             />
//           </div>

//           <div className="flex-1">
//             {loading ? (
//               <div className="text-center py-12">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                 <p className="mt-2 text-gray-600">Loading products...</p>
//               </div>
//             ) : products.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {products.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {pagination.totalPages > 1 && (
//                   <Pagination 
//                     pagination={pagination}
//                     onPageChange={handlePageChange}
//                   />
//                 )}
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };