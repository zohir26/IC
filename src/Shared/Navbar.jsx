"use client"
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronRight, FiUser, FiMenu, FiX } from 'react-icons/fi';

// Integrated Circuit seller company node data structure
export const nodeList = [
  {
    name: "Products",
    imageURL: "https://img.icons8.com/48/000000/microchip.png",
    itemId: "products",
    nodes: [
      {
        name: "Integrated Circuits",
        imageURL: "https://img.icons8.com/color/48/000000/processor.png",
        nodes: [
          { 
            name: "Microcontrollers", 
            nodes: [
              { name: "8-bit MCU" },
              { name: "16-bit MCU" },
              { name: "32-bit MCU" },
              { name: "ARM Cortex" }
            ]
          },
          { 
            name: "Processors", 
            nodes: [
              { name: "Digital Signal Processors" },
              { name: "Application Processors" },
              { name: "Graphics Processors" }
            ]
          },
          { 
            name: "Memory ICs", 
            nodes: [
              { name: "SRAM" },
              { name: "DRAM" },
              { name: "Flash Memory" },
              { name: "EEPROM" }
            ]
          },
          { 
            name: "Power Management ICs", 
            nodes: [
              { name: "Voltage Regulators" },
              { name: "DC-DC Converters" },
              { name: "Battery Management" }
            ]
          },
          { 
            name: "Sensors", 
            nodes: [
              { name: "Temperature Sensors" },
              { name: "Pressure Sensors" },
              { name: "Motion Sensors" },
              { name: "Optical Sensors" }
            ]
          }
        ]
      },
      {
        name: "Passive Components",
        nodes: [
          { 
            name: "Resistors", 
            nodes: [
              { name: "Fixed Resistors" },
              { name: "Variable Resistors" },
              { name: "Current Sense Resistors" }
            ]
          },
          { 
            name: "Capacitors", 
            nodes: [
              { name: "Ceramic Capacitors" },
              { name: "Electrolytic Capacitors" },
              { name: "Film Capacitors" }
            ]
          },
          { 
            name: "Inductors", 
            nodes: [
              { name: "Power Inductors" },
              { name: "RF Inductors" },
              { name: "Common Mode Chokes" }
            ]
          }
        ]
      },
      {
        name: "Discrete Semiconductors",
        nodes: [
          { 
            name: "Diodes", 
            nodes: [
              { name: "Rectifier Diodes" },
              { name: "Zener Diodes" },
              { name: "Schottky Diodes" },
              { name: "LED" }
            ]
          },
          { 
            name: "Transistors", 
            nodes: [
              { name: "MOSFET" },
              { name: "BJT" },
              { name: "IGBT" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "All Brands",
    imageURL: "https://img.icons8.com/48/000000/company.png",
    itemId: "brands",
    nodes: [
      {
        name: "Major Semiconductor Companies",
        nodes: [
          { 
            name: "Intel", 
            nodes: [
              { name: "Processors" },
              { name: "FPGAs" },
              { name: "Memory" }
            ]
          },
          { 
            name: "Texas Instruments", 
            nodes: [
              { name: "Analog ICs" },
              { name: "Microcontrollers" },
              { name: "Power Management" }
            ]
          },
          { 
            name: "Microchip Technology", 
            nodes: [
              { name: "PIC Microcontrollers" },
              { name: "AVR Microcontrollers" },
              { name: "dsPIC DSCs" }
            ]
          },
          { 
            name: "STMicroelectronics", 
            nodes: [
              { name: "STM32 MCUs" },
              { name: "Power Discretes" },
              { name: "MEMS Sensors" }
            ]
          }
        ]
      },
      {
        name: "Memory Manufacturers",
        nodes: [
          { 
            name: "Samsung", 
            nodes: [
              { name: "DRAM" },
              { name: "NAND Flash" },
              { name: "SSD Controllers" }
            ]
          },
          { 
            name: "Micron Technology", 
            nodes: [
              { name: "DRAM" },
              { name: "NAND Flash" },
              { name: "NOR Flash" }
            ]
          },
          { name: "SK Hynix", nodes: [] },
          { name: "Western Digital", nodes: [] }
        ]
      },
      {
        name: "Analog & Mixed Signal",
        nodes: [
          { 
            name: "Analog Devices", 
            nodes: [
              { name: "Data Converters" },
              { name: "Amplifiers" },
              { name: "RF Components" }
            ]
          },
          { 
            name: "Maxim Integrated", 
            nodes: [
              { name: "Power Management" },
              { name: "Interface ICs" },
              { name: "Sensors" }
            ]
          },
          { name: "Linear Technology", nodes: [] },
          { name: "Intersil", nodes: [] }
        ]
      }
    ]
  },
  {
    name: "Manufacturers",
    imageURL: "https://img.icons8.com/48/000000/factory.png",
    itemId: "manufacturers",
    nodes: [
      {
        name: "Foundries",
        nodes: [
          { 
            name: "TSMC", 
            nodes: [
              { name: "7nm Process" },
              { name: "5nm Process" },
              { name: "3nm Process" }
            ]
          },
          { 
            name: "GlobalFoundries", 
            nodes: [
              { name: "14nm Process" },
              { name: "12nm Process" },
              { name: "Specialty Technologies" }
            ]
          },
          { name: "UMC", nodes: [] },
          { name: "SMIC", nodes: [] }
        ]
      },
      {
        name: "Assembly & Test",
        nodes: [
          { 
            name: "ASE Group", 
            nodes: [
              { name: "IC Packaging" },
              { name: "Testing Services" },
              { name: "System-in-Package" }
            ]
          },
          { 
            name: "Amkor Technology", 
            nodes: [
              { name: "Advanced Packaging" },
              { name: "Automotive Solutions" },
              { name: "5G Solutions" }
            ]
          },
          { name: "JCET", nodes: [] },
          { name: "Powertech Technology", nodes: [] }
        ]
      },
      {
        name: "Equipment Suppliers",
        nodes: [
          { 
            name: "Applied Materials", 
            nodes: [
              { name: "Deposition Equipment" },
              { name: "Etch Equipment" },
              { name: "Metrology" }
            ]
          },
          { 
            name: "ASML", 
            nodes: [
              { name: "EUV Lithography" },
              { name: "DUV Lithography" },
              { name: "Metrology & Inspection" }
            ]
          },
          { name: "Lam Research", nodes: [] },
          { name: "KLA Corporation", nodes: [] }
        ]
      }
    ]
  }
];

// Additional navigation items without mega menu
const additionalNavItems = [
  { name: "Solutions", href: "/solutions" },
  { name: "Support", href: "/support" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" }
];

export default function MegaMenuNavbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState(null);

  const handleMouseEnter = (itemId, submenuName = null) => {
    if (menuTimeout) {
      clearTimeout(menuTimeout);
    }
    setActiveMenu(itemId);
    setHoveredSubmenu(submenuName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
      setHoveredSubmenu(null);
    }, 200);
    setMenuTimeout(timeout);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMegaMenu = (item) => {
    if (!item.nodes || item.nodes.length === 0) return null;

    return (
      <div 
        className="absolute left-0 top-full pt-2 z-50"
        onMouseEnter={() => handleMouseEnter(item.itemId)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-w-[600px] max-w-4xl">
              {item.nodes.map((category, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                    {category.imageURL && (
                      <img 
                        src={category.imageURL} 
                        alt={category.name}
                        className="w-6 h-6"
                      />
                    )}
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    {category.nodes && category.nodes.map((subcategory, subIndex) => (
                      <div key={subIndex} className="relative">
                        <div
                          className="flex items-center justify-between p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group cursor-pointer"
                          onMouseEnter={() => setHoveredSubmenu(`${category.name}-${subcategory.name}`)}
                        >
                          <div className="flex items-center space-x-2">
                            {subcategory.imageURL && (
                              <img 
                                src={subcategory.imageURL} 
                                alt={subcategory.name}
                                className="w-4 h-4"
                              />
                            )}
                            <span className="font-medium text-sm">{subcategory.name}</span>
                          </div>
                          {subcategory.nodes && subcategory.nodes.length > 0 && (
                            <FiChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                          )}
                        </div>

                        {/* Third level menu */}
                        {subcategory.nodes && subcategory.nodes.length > 0 && 
                         hoveredSubmenu === `${category.name}-${subcategory.name}` && (
                          <div className="absolute left-full top-0 ml-2 z-60">
                            <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[180px]">
                              <div className="p-2">
                                {subcategory.nodes.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 cursor-pointer text-sm"
                                  >
                                    {item.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => {
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpanded = (key) => {
      setExpandedItems(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    return (
      <div className="lg:hidden bg-blue-900/98 backdrop-blur-md border-t border-blue-700 max-h-screen overflow-y-auto">
        <div className="px-4 py-4 space-y-2">
          {nodeList.map((item) => (
            <div key={item.itemId} className="space-y-2">
              <button
                onClick={() => toggleExpanded(item.itemId)}
                className="w-full flex items-center justify-between p-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <span className="font-medium">{item.name}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems[item.itemId] ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedItems[item.itemId] && item.nodes && (
                <div className="ml-4 space-y-1">
                  {item.nodes.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <button
                        onClick={() => toggleExpanded(`${item.itemId}-${category.name}`)}
                        className="w-full flex items-center justify-between p-2 text-blue-200 hover:bg-white/5 rounded text-sm"
                      >
                        <span>{category.name}</span>
                        {category.nodes && category.nodes.length > 0 && (
                          <FiChevronRight className={`w-3 h-3 transition-transform duration-200 ${expandedItems[`${item.itemId}-${category.name}`] ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      
                      {expandedItems[`${item.itemId}-${category.name}`] && category.nodes && (
                        <div className="ml-4 space-y-1">
                          {category.nodes.map((subcategory, subIndex) => (
                            <div key={subIndex} className="p-2 text-blue-300 hover:bg-white/5 rounded text-sm cursor-pointer">
                              {subcategory.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {additionalNavItems.map((item) => (
            <div key={item.href} className="p-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer">
              {item.name}
            </div>
          ))}

          <div className="pt-4 border-t border-blue-700">
            <div className="flex items-center space-x-2 p-3 bg-white text-blue-800 rounded-lg font-semibold cursor-pointer">
              <FiUser className="w-4 h-4" />
              <span>Sign In</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-blue-900/95 backdrop-blur-md shadow-lg' : 'bg-blue-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 z-10">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-blue-800 font-bold text-lg">NS</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">Neural Semiconductor</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {nodeList.map((item) => (
              <div 
                key={item.itemId} 
                className="relative"
                onMouseLeave={handleMouseLeave}
              >
                <div
                  onMouseEnter={() => handleMouseEnter(item.itemId)}
                  className={`flex items-center px-4 py-2 text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-all duration-200 rounded-lg hover:bg-white/10 cursor-pointer ${
                    activeMenu === item.itemId ? 'bg-white/10' : ''
                  }`}
                >
                  {item.name}
                  <FiChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    activeMenu === item.itemId ? 'rotate-180' : ''
                  }`} />
                </div>

                {activeMenu === item.itemId && renderMegaMenu(item)}
              </div>
            ))}

            {additionalNavItems.map((item) => (
              <div
                key={item.href}
                className="px-4 py-2 text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-all duration-200 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer">
              <FiUser className="w-4 h-4" />
              <span>Sign In</span>
            </div>
            
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
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
  );
}