"use client";
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiMenu, FiX, FiSettings, FiExternalLink, FiLoader } from "react-icons/fi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { api, slugify } from '@/lib/utils';

export default function Navbar() {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserBubble, setShowUserBubble] = useState(false);
  const [navlink, setNavLink] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brandsError, setBrandsError] = useState(null);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

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

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true);
      setBrandsError(null);
      const data = await api.get('/api/brands');
      setBrands(data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrandsError(err.message);
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Konami code for admin access
  useEffect(() => {
    let sequence = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    const handleKeyDown = (e) => {
      sequence.push(e.code);
      sequence = sequence.slice(-konamiCode.length);
      
      if (sequence.join('') === konamiCode.join('')) {
        setShowAdminAccess(true);
        setTimeout(() => setShowAdminAccess(false), 5000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (itemId) => {
    setActiveMenu(itemId);
    // Fetch brands data when manufacturers menu is hovered
    if (itemId === 'manufacturers' && brands.length === 0 && !brandsLoading) {
      fetchBrands();
    }
  };

  const handleMouseLeave = () => setActiveMenu(null);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserBubble = () => setShowUserBubble((prev) => !prev);

  const generateProductUrl = (item, category, sub, subItem) => {
    const mainItem = item.itemId;

    if (mainItem === 'products') {
      if (subItem && subItem.id) {
        return `/products/category/${category.id}/${sub.id}/${subItem.id}`;
      } else if (sub && sub.id) {
        return `/products/category/${category.id}/${sub.id}`;
      } else if (category && category.id) {
        return `/products/category/${category.id}`;
      }
    } else if (mainItem === 'manufacturers') {
      if (subItem && subItem.id) {
        return `/products/manufacturer/${category.id}/${sub.id}/${subItem.id}`;
      } else if (sub && sub.id) {
        return `/products/manufacturer/${category.id}/${sub.id}`;
      } else if (category && (category.id || category.name)) {
        const manufacturerId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
        return `/products/manufacturer/${manufacturerId}`;
      }
    }

    return '/products';
  };

  const renderManufacturersBrands = () => {
    if (brandsLoading) {
      return (
        <div className="p-6 text-center">
          <FiLoader className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Loading manufacturers...</p>
        </div>
      );
    }

    if (brandsError) {
      return (
        <div className="p-6 text-center">
          <p className="text-sm text-red-600 mb-2">Error loading manufacturers</p>
          <button 
            onClick={fetchBrands}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (brands.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">No manufacturers found</p>
        </div>
      );
    }

    return (
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 min-w-[700px] max-w-[1200px]">
        {brands.map((brand) => (
          <Link 
            key={brand.brandId || brand.name} 
            href={`/brands/${slugify(brand.name)}`}
            className="group"
            onClick={() => setActiveMenu(null)}
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer text-center">
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                {brand.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderMegaMenu = (item) => {
    if (!item.nodes) return null;
    
    const isManufacturers = item.itemId === 'manufacturers';
    
    // For manufacturers, show brands from database instead of JSON nodes
    if (isManufacturers) {
      return (
        <div
          className="absolute left-0 top-full pt-2 z-50"
          onMouseEnter={() => handleMouseEnter(item.itemId)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            {renderManufacturersBrands()}
            
            {/* Footer section */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Explore manufacturers and their products
                </span>
                <Link
                  href="/brands"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  onClick={() => setActiveMenu(null)}
                >
                  View All <FiExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // For products, show the original navigation structure
    const gridCols = 'lg:grid-cols-3';
    const maxWidth = 'max-w-[1000px]';
    
    return (
      <div
        className="absolute left-0 top-full pt-2 z-50"
        onMouseEnter={() => handleMouseEnter(item.itemId)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className={`p-6 grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6 min-w-[700px] ${maxWidth}`}>
            {item.nodes.map((category, index) => (
              <div key={index} className="space-y-2">
                <Link
                  href={generateProductUrl(item, category)}
                  className="text-gray-800 font-semibold border-b border-gray-200 pb-2 text-sm hover:text-blue-600 block transition-colors group"
                  onClick={() => setActiveMenu(null)}
                >
                  <div className="flex items-center">
                    {category.imageURL && (
                      <img
                        src={category.imageURL}
                        alt={category.name}
                        className="inline w-5 h-5 mr-2"
                      />
                    )}
                    <span className="group-hover:text-blue-600">{category.name}</span>
                  </div>
                </Link>
                
                {/* Render subcategories */}
                {category.nodes && category.nodes.length > 0 && (
                  <ul className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {category.nodes.map((sub, idx) => (
                      <li key={idx}>
                        <Link
                          href={generateProductUrl(item, category, sub)}
                          className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm block py-1 hover:bg-blue-50 px-2 rounded transition-all duration-200 group"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{sub.name}</span>
                            {sub.nodes && sub.nodes.length > 0 && (
                              <FiChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            )}
                          </div>
                        </Link>
                        
                        {/* Render sub-subcategories */}
                        {sub.nodes && sub.nodes.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {sub.nodes.map((subItem, subIdx) => (
                              <li key={subIdx}>
                                <Link
                                  href={generateProductUrl(item, category, sub, subItem)}
                                  className="text-gray-500 hover:text-blue-500 cursor-pointer text-xs block py-0.5 hover:bg-blue-50 px-2 rounded transition-all duration-200"
                                  onClick={() => setActiveMenu(null)}
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
                )}
              </div>
            ))}
          </div>
          
          {/* Footer section for products */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Browse all product categories and specifications
              </span>
              <Link
                href="/products"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                onClick={() => setActiveMenu(null)}
              >
                View All <FiExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div className="lg:hidden bg-blue-900 border-t border-blue-700 max-h-96 overflow-y-auto">
      <div className="px-4 py-2 space-y-2">
        {navlink.map((item) => (
          <div key={item.itemId} className="space-y-1">
            <div className="flex items-center justify-between py-2 text-white">
              <span className="font-medium">{item.name}</span>
              <FiChevronDown className="w-4 h-4" />
            </div>
            {item.itemId === 'manufacturers' ? (
              // For manufacturers, show brands from database
              <div className="pl-4 space-y-1 max-h-48 overflow-y-auto">
                {brandsLoading ? (
                  <div className="text-blue-200 text-sm py-2">
                    <FiLoader className="w-4 h-4 animate-spin inline mr-2" />
                    Loading manufacturers...
                  </div>
                ) : brandsError ? (
                  <div className="text-red-300 text-sm py-2">
                    Error loading manufacturers
                    <button 
                      onClick={fetchBrands}
                      className="block text-blue-200 hover:text-white underline text-xs mt-1"
                    >
                      Try again
                    </button>
                  </div>
                ) : brands.length > 0 ? (
                  brands.slice(0, 15).map((brand) => (
                    <Link
                      key={brand.brandId || brand.name}
                      href={`/brands/${slugify(brand.name)}`}
                      className="text-blue-200 text-sm font-medium hover:text-white block py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))
                ) : (
                  <div className="text-blue-200 text-sm py-2">
                    No manufacturers found
                  </div>
                )}
                {brands.length > 15 && (
                  <div className="text-blue-100 text-xs px-2 py-1">
                    +{brands.length - 15} more
                  </div>
                )}
              </div>
            ) : (
              // For other items, show original structure
              item.nodes && (
                <div className="pl-4 space-y-1 max-h-48 overflow-y-auto">
                  {item.nodes.map((category, idx) => (
                    <div key={idx} className="py-1">
                      <Link
                        href={generateProductUrl(item, category)}
                        className="text-blue-200 text-sm font-medium hover:text-white block py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      {category.nodes && category.nodes.length > 0 && (
                        <div className="pl-4 mt-1 space-y-1">
                          {category.nodes.slice(0, 5).map((sub, subIdx) => (
                            <Link
                              key={subIdx}
                              href={generateProductUrl(item, category, sub)}
                              className="block text-blue-100 text-sm py-0.5 hover:text-white"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {category.nodes.length > 5 && (
                            <div className="text-blue-100 text-xs px-2 py-1">
                              +{category.nodes.length - 5} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        ))}
        <div className="border-t border-blue-700 pt-2 space-y-2">
          <Link href="/solution" className="block py-2 text-white hover:text-blue-200">Solutions</Link>
          <Link href="/support" className="block py-2 text-white hover:text-blue-200">Support</Link>
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
              <div className="w-10 h-10">
                <img src="/Ic Logo.png" alt="Redwood Logo" />
              </div>
              <Link href="/">
                <p className="text-white text-xl hidden sm:block">
                  <span className="font-bold mr-4">Redwood</span>
                  <span>Analytics and Intelligence</span>
                </p>
              </Link>
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
              <div className="w-10 h-10">
                <Link href="/">
                  <img src="/Ic Logo.png" alt="Redwood Logo" />
                </Link>
              </div>
              <Link href="/">
                <p className="text-white text-xl hidden sm:block">
                  <span className="font-bold mr-4">Redwood</span>
                  <span>Analytics and Intelligence</span>
                </p>
              </Link>
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
                  <div className={`flex items-center px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-300 ${activeMenu === item.itemId ? "bg-white/10 text-blue-200" : ""}`}>
                    {item.imageURL && (
                      <img 
                        src={item.imageURL} 
                        alt={item.name}
                        className="w-4 h-4 mr-2 opacity-80"
                      />
                    )}
                    {item.name}
                    <FiChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeMenu === item.itemId ? 'rotate-180' : ''}`} />
                  </div>
                  {activeMenu === item.itemId && renderMegaMenu(item)}
                </div>
              ))}
              
              {/* Additional Navigation Items */}
              <Link href="/solution" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">
                Solutions
              </Link>
              <Link href="/support" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">
                Support
              </Link>
              <Link href="/about" className="px-4 py-2 text-white hover:text-blue-200 transition-colors">
                About
              </Link>
            </div>

            {/* User Auth & Actions */}
            <div className="relative flex items-center space-x-4">
              {session && session.user.email === "tanvir@gmail.com" ? (
                <>
                  <div className="relative">
                    <img
                      src={session.user?.image || "/default-user.png"}
                      alt="Admin User"
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={toggleUserBubble}
                    />

                    {showUserBubble && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-sm rounded-lg shadow-xl z-50 p-4 space-y-2 border border-gray-200">
                        <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                          <img
                            src={session.user?.image || "/default-user.png"}
                            alt="Admin User"
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-gray-800 font-semibold">{session.user.name}</p>
                            <p className="text-gray-500 text-xs">{session.user.email}</p>
                          </div>
                        </div>
                        <Link 
                          href="/dashboard" 
                          className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-2 rounded transition-colors"
                          onClick={() => setShowUserBubble(false)}
                        >
                          <FiSettings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserBubble(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="flex items-center w-full text-left text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-2 rounded transition-colors"
                        >
                          <FiX className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Hidden admin access */}
                  {showAdminAccess && (
                    <Link
                      href="/admin/login"
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center"
                      title="Admin Access"
                    >
                      <FiSettings className="w-4 h-4" />
                    </Link>
                  )}
                </>
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

      {/* Footer admin access hint */}
      <div 
        className="fixed bottom-4 right-4 text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
        onDoubleClick={() => setShowAdminAccess(true)}
        title="Double-click for admin access"
      >
        •
      </div>

      {/* Custom styles for scrollbars and animations */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}