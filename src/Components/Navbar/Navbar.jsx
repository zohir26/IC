"use client";
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserBubble, setShowUserBubble] = useState(false);
  const [navlink, setNavLink] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/navmenu.json');
        if (!response.ok) {
          throw new Error('Failed to fetch navigation data');
        }
        const data = await response.json();
        setNavLink(data.nodeList || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching navigation data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNavData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (itemId) => setActiveMenu(itemId);
  const handleMouseLeave = () => setActiveMenu(null);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserBubble = () => setShowUserBubble((prev) => !prev);

  // FIXED: Generate URLs that match your [...slug] route structure
  const generateProductUrl = (item, category, sub, subItem) => {
    const mainItem = item.itemId; // products, brands, manufacturers
    
    if (mainItem === 'products') {
      // For products, use category-based routing
      if (subItem && subItem.id) {
        // Most specific: /products/category/[category]/[sub]/[subItem]
        return `/products/category/${category.id}/${sub.id}/${subItem.id}`;
      } else if (sub && sub.id) {
        // Sub-category: /products/category/[category]/[sub]
        return `/products/category/${category.id}/${sub.id}`;
      } else if (category && category.id) {
        // Main category: /products/category/[category]
        return `/products/category/${category.id}`;
      }
    } else if (mainItem === 'brands') {
      // For brands: /products/brand/[brandId]
      // The category here is actually the brand object
      if (category && (category.id || category.name)) {
        const brandId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
        return `/products/brand/${brandId}`;
      }
    } else if (mainItem === 'manufacturers') {
      // For manufacturers: /products/manufacturer/[manufacturerId]
      // The category here is actually the manufacturer object
      if (category && (category.id || category.name)) {
        const manufacturerId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
        return `/products/manufacturer/${manufacturerId}`;
      }
    }
    
    // Fallback
    return '/products';
  };

  const renderMegaMenu = (item) => {
    if (!item.nodes) return null;
    return (
      <div 
        className="absolute left-0 top-full pt-2 z-50" 
        onMouseEnter={() => handleMouseEnter(item.itemId)} 
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[600px] max-w-[900px]">
            {item.nodes.map((category, index) => (
              <div key={index} className="space-y-2">
                <Link 
                  href={generateProductUrl(item, category)}
                  className="text-gray-800 font-semibold border-b pb-1 text-sm hover:text-blue-600 block"
                >
                  {category.imageURL && (
                    <img 
                      src={category.imageURL} 
                      alt={category.name} 
                      className="inline w-5 h-5 mr-2"
                    />
                  )}
                  {category.name}
                </Link>
                <ul className="space-y-1">
                  {category.nodes && category.nodes.map((sub, idx) => (
                    <li key={idx}>
                      <Link 
                        href={generateProductUrl(item, category, sub)}
                        className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm block py-1 hover:bg-gray-50 px-2 rounded transition-colors"
                      >
                        {sub.name}
                      </Link>
                      {sub.nodes && sub.nodes.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {sub.nodes.map((subItem, subIdx) => (
                            <li key={subIdx}>
                              <Link 
                                href={generateProductUrl(item, category, sub, subItem)}
                                className="text-gray-500 hover:text-blue-500 cursor-pointer text-xs block py-0.5 hover:bg-gray-50 px-2 rounded transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div className="lg:hidden bg-blue-900 border-t border-blue-700">
      <div className="px-4 py-2 space-y-2">
        {navlink.map((item) => (
          <div key={item.itemId} className="space-y-1">
            <div className="flex items-center justify-between py-2 text-white">
              <span className="font-medium">{item.name}</span>
              <FiChevronDown className="w-4 h-4" />
            </div>
            {item.nodes && (
              <div className="pl-4 space-y-1">
                {item.nodes.map((category, idx) => (
                  <div key={idx} className="py-1">
                    <Link 
                      href={generateProductUrl(item, category)}
                      className="text-blue-200 text-sm font-medium hover:text-white block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.nodes && (
                      <div className="pl-4 mt-1 space-y-1">
                        {category.nodes.map((sub, subIdx) => (
                          <Link 
                            key={subIdx}
                            href={generateProductUrl(item, category, sub)}
                            className="block text-blue-100 text-sm py-1 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="border-t border-blue-700 pt-2 space-y-2">
          <Link href="/solution" className="block py-2 text-white hover:text-blue-200">Solutions</Link>
          <Link href="/support" className="block py-2 text-white hover:text-blue-200">Support</Link>
          <Link href="/resources" className="block py-2 text-white hover:text-blue-200">Resources</Link>
          <Link href="/about" className="block py-2 text-white hover:text-blue-200">About</Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-800">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-blue-800 font-bold text-lg">NS</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">Neural Semiconductor</span>
            </div>
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    console.error('Navigation error:', error);
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-blue-900/95 backdrop-blur-md shadow-lg" : "bg-blue-800"}`}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-blue-800 font-bold text-lg">
                  <Link href="/">NS</Link>
                </span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                <Link href="/">Neural Semiconductor</Link>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navlink.map((item) => (
                <div 
                  key={item.itemId} 
                  onMouseEnter={() => handleMouseEnter(item.itemId)} 
                  onMouseLeave={handleMouseLeave} 
                  className="relative"
                >
                  <div className={`flex items-center px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg cursor-pointer transition-colors ${activeMenu === item.itemId ? "bg-white/10" : ""}`}>
                    {item.name}
                    <FiChevronDown className="ml-1 w-4 h-4" />
                  </div>
                  {activeMenu === item.itemId && renderMegaMenu(item)}
                </div>
              ))}
              <Link href="/solution" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Solutions</Link>
              <Link href="/support" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Support</Link>
              <Link href="/resources" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Resources</Link>
              <Link href="/about" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">About</Link>
            </div>

            {/* User Auth & Actions */}
            <div className="relative flex items-center space-x-4">
              {session ? (
                <>
                  <div className="relative">
                    <img
                      src={session.user?.image || "/default-user.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={toggleUserBubble}
                    />

                    {showUserBubble && session.user.email === "tanvir@gmail.com" && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-sm rounded-lg shadow-xl z-50 p-4 space-y-2">
                        <p className="text-gray-800 font-semibold">{session.user.name}</p>
                        <p className="text-gray-600">{session.user.email}</p>
                        <Link href="/dashboard" className="block text-blue-600 hover:underline">Go to Dashboard</Link>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="hidden sm:block px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md transition-colors"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && renderMobileMenu()}
      </nav>
    </>
  );
}

// "use client";
// import React, { useState, useEffect } from "react";
// import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showUserBubble, setShowUserBubble] = useState(false);
//   const [navlink, setNavLink] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOption, setSortOption] = useState({ sort: 'name', order: 'asc' });
//   const [quickFilter, setQuickFilter] = useState({});

//   useEffect(() => {
//     const fetchNavData = async () => {
//       try {
//         setLoading(true);
//         const [categoriesRes, brandsRes, manufacturersRes] = await Promise.all([
//           fetch('/api/products/categories'),
//           fetch('/api/products/brands'),
//           fetch('/api/products/manufacturers'),
//         ]);

//         if (!categoriesRes.ok || !brandsRes.ok || !manufacturersRes.ok) {
//           throw new Error('Failed to fetch navigation data');
//         }

//         const categoriesData = await categoriesRes.json();
//         const brandsData = await brandsRes.json();
//         const manufacturersData = await manufacturersRes.json();

//         // Transform API data into navlink structure
//         const navData = [
//           {
//             itemId: 'products',
//             name: 'Products',
//             nodes: (categoriesData.categories || []).map(cat => ({
//               id: cat._id.category,
//               name: cat.displayName || cat._id.category.replace(/-/g, ' '),
//               nodes: cat._id.type
//                 ? [{ id: cat._id.type, name: cat._id.type.replace(/-/g, ' ') }]
//                 : [],
//             })),
//           },
//           {
//             itemId: 'brands',
//             name: 'Brands',
//             nodes: (brandsData.brands || []).map(brand => ({
//               id: brand._id.brand,
//               name: brand.displayName,
//             })),
//           },
//           {
//             itemId: 'manufacturers',
//             name: 'Manufacturers',
//             nodes: (manufacturersData.manufacturers || []).map(mfg => ({
//               id: mfg._id.manufacturer,
//               name: mfg.displayName,
//             })),
//           },
//         ];

//         setNavLink(navData);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching navigation data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNavData();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleMouseEnter = (itemId) => setActiveMenu(itemId);
//   const handleMouseLeave = () => setActiveMenu(null);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleUserBubble = () => setShowUserBubble((prev) => !prev);

//   const handleSortChange = (sort, order) => {
//     setSortOption({ sort, order });
//   };

//   const handleQuickFilterChange = (filterType, value) => {
//     setQuickFilter((prev) => {
//       const newFilters = { ...prev };
//       if (filterType === 'availability') {
//         newFilters.availability = value;
//       } else if (filterType === 'priceRange') {
//         newFilters.minPrice = value.min ? Number(value.min) : undefined;
//         newFilters.maxPrice = value.max ? Number(value.max) : undefined;
//       }
//       return newFilters;
//     });
//   };

//   const generateProductUrl = (item, category, sub, subItem) => {
//     const mainItem = item.itemId;
//     const queryParams = new URLSearchParams({
//       ...quickFilter,
//       sort: sortOption.sort,
//       order: sortOption.order,
//     });

//     if (mainItem === 'products') {
//       if (subItem && subItem.id) {
//         return `/products/category/${category.id}/${sub.id}/${subItem.id}?${queryParams.toString()}`;
//       } else if (sub && sub.id) {
//         return `/products/category/${category.id}/${sub.id}?${queryParams.toString()}`;
//       } else if (category && category.id) {
//         return `/products/category/${category.id}?${queryParams.toString()}`;
//       }
//     } else if (mainItem === 'brands') {
//       if (category && category.id) {
//         return `/products/brand/${category.id}?${queryParams.toString()}`;
//       }
//     } else if (mainItem === 'manufacturers') {
//       if (category && category.id) {
//         return `/products/manufacturer/${category.id}?${queryParams.toString()}`;
//       }
//     }

//     return `/products?${queryParams.toString()}`;
//   };

//   const renderMegaMenu = (item) => {
//     if (!item.nodes) return null;
//     return (
//       <div
//         className="absolute left-0 top-full pt-2 z-50"
//         onMouseEnter={() => handleMouseEnter(item.itemId)}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[600px] max-w-[900px]">
//             {item.nodes.map((category, index) => (
//               <div key={index} className="space-y-2">
//                 <Link
//                   href={generateProductUrl(item, category)}
//                   className="text-gray-800 font-semibold border-b pb-1 text-sm hover:text-blue-600 block"
//                 >
//                   {category.imageURL && (
//                     <img
//                       src={category.imageURL}
//                       alt={category.name}
//                       className="inline w-5 h-5 mr-2"
//                     />
//                   )}
//                   {category.name}
//                 </Link>
//                 <ul className="space-y-1">
//                   {category.nodes && category.nodes.map((sub, idx) => (
//                     <li key={idx}>
//                       <Link
//                         href={generateProductUrl(item, category, sub)}
//                         className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm block py-1 hover:bg-gray-50 px-2 rounded transition-colors"
//                       >
//                         {sub.name}
//                       </Link>
//                       {sub.nodes && sub.nodes.length > 0 && (
//                         <ul className="ml-4 mt-1 space-y-1">
//                           {sub.nodes.map((subItem, subIdx) => (
//                             <li key={subIdx}>
//                               <Link
//                                 href={generateProductUrl(item, category, sub, subItem)}
//                                 className="text-gray-500 hover:text-blue-500 cursor-pointer text-xs block py-0.5 hover:bg-gray-50 px-2 rounded transition-colors"
//                               >
//                                 {subItem.name}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSortFilterControls = () => (
//     <div className="relative group">
//       <button className="text-white hover:text-blue-200 px-4 py-2 rounded-lg flex items-center">
//         Sort & Filter
//         <FiChevronDown className="ml-1 w-4 h-4" />
//       </button>
//       <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-4 min-w-[200px] z-50">
//         <div className="space-y-4">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">Sort By</h4>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//               value={`${sortOption.sort}-${sortOption.order}`}
//               onChange={(e) => {
//                 const [sort, order] = e.target.value.split('-');
//                 handleSortChange(sort, order);
//               }}
//             >
//               <option value="name-asc">Name A-Z</option>
//               <option value="name-desc">Name Z-A</option>
//               <option value="price-asc">Price Low to High</option>
//               <option value="price-desc">Price High to Low</option>
//             </select>
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">Quick Filters</h4>
//             <label className="flex items-center text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 className="mr-2"
//                 checked={quickFilter.availability === 'In Stock'}
//                 onChange={(e) =>
//                   handleQuickFilterChange('availability', e.target.checked ? 'In Stock' : undefined)
//                 }
//               />
//               In Stock Only
//             </label>
//             <div className="mt-2">
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
//                 value={quickFilter.minPrice || ''}
//                 onChange={(e) =>
//                   handleQuickFilterChange('priceRange', {
//                     min: e.target.value,
//                     max: quickFilter.maxPrice,
//                   })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 value={quickFilter.maxPrice || ''}
//                 onChange={(e) =>
//                   handleQuickFilterChange('priceRange', {
//                     min: quickFilter.minPrice,
//                     max: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderMobileMenu = () => (
//     <div className="lg:hidden bg-blue-900 border-t border-blue-700">
//       <div className="px-4 py-2 space-y-2">
//         {navlink.map((item) => (
//           <div key={item.itemId} className="space-y-1">
//             <div className="flex items-center justify-between py-2 text-white">
//               <span className="font-medium">{item.name}</span>
//               <FiChevronDown className="w-4 h-4" />
//             </div>
//             {item.nodes && (
//               <div className="pl-4 space-y-1">
//                 {item.nodes.map((category, idx) => (
//                   <div key={idx} className="py-1">
//                     <Link
//                       href={generateProductUrl(item, category)}
//                       className="text-blue-200 text-sm font-medium hover:text-white block"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                     >
//                       {category.name}
//                     </Link>
//                     {category.nodes && (
//                       <div className="pl-4 mt-1 space-y-1">
//                         {category.nodes.map((sub, subIdx) => (
//                           <Link
//                             key={subIdx}
//                             href={generateProductUrl(item, category, sub)}
//                             className="block text-blue-100 text-sm py-1 hover:text-white"
//                             onClick={() => setIsMobileMenuOpen(false)}
//                           >
//                             {sub.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//         <div className="border-t border-blue-700 pt-2 space-y-2">
//           <div className="py-2">
//             <span className="font-medium text-white">Sort & Filter</span>
//             <div className="pl-4 mt-1 space-y-2">
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800"
//                 value={`${sortOption.sort}-${sortOption.order}`}
//                 onChange={(e) => {
//                   const [sort, order] = e.target.value.split('-');
//                   handleSortChange(sort, order);
//                 }}
//               >
//                 <option value="name-asc">Name A-Z</option>
//                 <option value="name-desc">Name Z-A</option>
//                 <option value="price-asc">Price Low to High</option>
//                 <option value="price-desc">Price High to Low</option>
//               </select>
//               <label className="flex items-center text-sm text-white">
//                 <input
//                   type="checkbox"
//                   className="mr-2"
//                   checked={quickFilter.availability === 'In Stock'}
//                   onChange={(e) =>
//                     handleQuickFilterChange('availability', e.target.checked ? 'In Stock' : undefined)
//                   }
//                 />
//                 In Stock Only
//               </label>
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800"
//                 value={quickFilter.minPrice || ''}
//                 onChange={(e) =>
//                   handleQuickFilterChange('priceRange', {
//                     min: e.target.value,
//                     max: quickFilter.maxPrice,
//                   })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800"
//                 value={quickFilter.maxPrice || ''}
//                 onChange={(e) =>
//                   handleQuickFilterChange('priceRange', {
//                     min: quickFilter.minPrice,
//                     max: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <Link href="/solution" className="block py-2 text-white hover:text-blue-200">Solutions</Link>
//           <Link href="/support" className="block py-2 text-white hover:text-blue-200">Support</Link>
//           <Link href="/resources" className="block py-2 text-white hover:text-blue-200">Resources</Link>
//           <Link href="/about" className="block py-2 text-white hover:text-blue-200">About</Link>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-800">
//         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
//                 <span className="text-blue-800 font-bold text-lg">NS</span>
//               </div>
//               <span className="text-white font-bold text-xl hidden sm:block">Neural Semiconductor</span>
//             </div>
//             <div className="text-white">Loading...</div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   if (error) {
//     console.error('Navigation error:', error);
//   }

//   return (
//     <>
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-blue-900/95 backdrop-blur-md shadow-lg" : "bg-blue-800"}`}>
//         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-2 cursor-pointer">
//               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
//                 <span className="text-blue-800 font-bold text-lg">
//                   <Link href="/">NS</Link>
//                 </span>
//               </div>
//               <span className="text-white font-bold text-xl hidden sm:block">
//                 <Link href="/">Neural Semiconductor</Link>
//               </span>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center space-x-4">
//               {navlink.map((item) => (
//                 <div
//                   key={item.itemId}
//                   onMouseEnter={() => handleMouseEnter(item.itemId)}
//                   onMouseLeave={handleMouseLeave}
//                   className="relative"
//                 >
//                   <div className={`flex items-center px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg cursor-pointer transition-colors ${activeMenu === item.itemId ? "bg-white/10" : ""}`}>
//                     {item.name}
//                     <FiChevronDown className="ml-1 w-4 h-4" />
//                   </div>
//                   {activeMenu === item.itemId && renderMegaMenu(item)}
//                 </div>
//               ))}
//               {renderSortFilterControls()}
//               <Link href="/solution" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Solutions</Link>
//               <Link href="/support" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Support</Link>
//               <Link href="/resources" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">Resources</Link>
//               <Link href="/about" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">About</Link>
//             </div>

//             {/* User Auth & Actions */}
//             <div className="relative flex items-center space-x-4">
//               {session ? (
//                 <>
//                   <div className="relative">
//                     <img
//                       src={session.user?.image || "/default-user.png"}
//                       alt="User"
//                       className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:shadow-lg transition-shadow"
//                       onClick={toggleUserBubble}
//                     />
//                     {showUserBubble && session.user.email === "tanvir@gmail.com" && (
//                       <div className="absolute right-0 mt-2 w-64 bg-white text-sm rounded-lg shadow-xl z-50 p-4 space-y-2">
//                         <p className="text-gray-800 font-semibold">{session.user.name}</p>
//                         <p className="text-gray-600">{session.user.email}</p>
//                         <Link href="/dashboard" className="block text-blue-600 hover:underline">Go to Dashboard</Link>
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => signOut()}
//                     className="hidden sm:block px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md transition-colors"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => signIn()}
//                   className="px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md transition-colors"
//                 >
//                   Sign In
//                 </button>
//               )}
//               <button
//                 onClick={toggleMobileMenu}
//                 className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
//                 aria-label="Toggle mobile menu"
//               >
//                 {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && renderMobileMenu()}
//       </nav>
//     </>
//   );
// }