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

  // Generate dynamic URLs based on navigation structure
  const generateProductUrl = (item, category, sub, subItem) => {
    const mainItem = item.itemId; // products, brands, manufacturers
    
    if (mainItem === 'products') {
      // For products, route by category hierarchy
      if (subItem) {
        return `/products/${subItem.id}?type=${subItem.id}&category=${sub.id}&parentCategory=${category.id}`;
      } else if (sub) {
        return `/products/${sub.id}?category=${sub.id}&parentCategory=${category.id}`;
      } else {
        return `/products/${category.id}?parentCategory=${category.id}`;
      }
    } else if (mainItem === 'brands') {
      // For brands, route to brand-specific page
      if (subItem) {
        return `/products/brands/${sub.id}?brand=${sub.id}&category=${subItem.id}`;
      } else if (sub) {
        return `/products/brands/${sub.id}?brand=${sub.id}`;
      } else {
        return `/products/brands/${category.id}?brand=${category.id}`;
      }
    } else if (mainItem === 'manufacturers') {
      // For manufacturers, route to manufacturer-specific page
      if (subItem) {
        return `/products/manufacturers/${sub.id}?manufacturer=${sub.id}&category=${subItem.id}`;
      } else if (sub) {
        return `/products/manufacturers/${sub.id}?manufacturer=${sub.id}`;
      } else {
        return `/products/manufacturers/${category.id}?manufacturer=${category.id}`;
      }
    }
    
    // Fallback
    return `/products?search=${encodeURIComponent(subItem?.name || sub?.name || category?.name)}`;
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