"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { 
    label: 'Products', 
    href: '/products', 
    submenu: [
      { 
        label: 'Integrated Circuits', 
        href: '/products/integrated-circuits', 
        subsubmenu: [
          { label: 'Microcontrollers', href: '/products/integrated-circuits/microcontrollers' },
          { label: 'Sensors', href: '/products/integrated-circuits/sensors' },
          { label: 'Processors', href: '/products/integrated-circuits/processors' },
          { label: 'Power Management ICs', href: '/products/integrated-circuits/power-management-ics' },
          { label: 'Memory ICs', href: '/products/integrated-circuits/memory-ics' },
        ]
      },
      { label: 'Resistors', href: '/products/resistors' },
      { label: 'Capacitors', href: '/products/capacitors' },
    ]
  },
  { 
    label: 'All Brands', 
    href: '/brands', 
    submenu: [
      { label: 'Intel', href: '/brands/intel' },
      { label: 'Samsung', href: '/brands/samsung' },
      { label: 'Texas Instruments', href: '/brands/texas-instruments' },
      { label: 'Qualcomm', href: '/brands/qualcomm' },
      { label: 'NXP', href: '/brands/nxp' },
      { label: 'Broadcom', href: '/brands/broadcom' },
      { label: 'Microchip', href: '/brands/microchip' },
    ]
  },
  { label: 'Compare', href: '/compare' },
  { label: 'News', href: '/news' },
  { label: 'Videos', href: '/videos' },
];

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);

  return (
    <nav className="flex items-center justify-between px-26 py-2 bg-blue-800 text-white shadow-md">
      {/* Logo Section */}
      <div className="flex-shrink-0">
        <Link href="/">
          <Image src="/ic Logo.png" alt="Logo" width={100} height={20} />
        </Link>
      </div>

      {/* Navigation Menu */}
      <ul className="lg:flex lg:space-x-10">
        {navItems.map((item) => (
          <li 
            key={item.href} 
            className="relative text-white p-2 hover:bg-blue-400 hover:rounded-lg text-2xl font-bold group"
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => {
              setHoveredItem(null);
              setHoveredSubmenu(null);
            }}
          >
            <Link href={item.href}>{item.label}</Link>

            {/* Submenu */}
            {item.submenu && hoveredItem === item.label && (
              <div className="absolute left-0 top-full bg-white text-black rounded-md shadow-lg w-64 z-50 text-xl">
                <ul className="p-4">
                  {item.submenu.map((submenu) => (
                    <li 
                      key={submenu.href} 
                      className="mb-2 relative"
                      onMouseEnter={() => setHoveredSubmenu(submenu.label)}
                      onMouseLeave={() => setHoveredSubmenu(null)}
                    >
                      <Link href={submenu.href} className="block p-2 hover:bg-blue-200 rounded">
                        {submenu.label}
                      </Link>

                      {/* Sub-submenu for "Integrated Circuits" */}
                      {submenu.subsubmenu && hoveredSubmenu === submenu.label && (
                        <div className="absolute left-full top-0 bg-white text-black rounded-md shadow-lg w-64 z-50 text-xl">
                          <ul className="p-4">
                            {submenu.subsubmenu.map((subitem) => (
                              <li key={subitem.href} className="mb-2">
                                <Link href={subitem.href} className="block p-2 hover:bg-blue-200 rounded">
                                  {subitem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}