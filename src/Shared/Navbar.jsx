"use client";
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

// Simulated Mega Menu Structure
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

export default function Navbar() {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserBubble, setShowUserBubble] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (itemId) => setActiveMenu(itemId);
  const handleMouseLeave = () => setActiveMenu(null);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserBubble = () => setShowUserBubble((prev) => !prev);

  const renderMegaMenu = (item) => {
    if (!item.nodes) return null;
    return (
      <div className="absolute left-0 top-full pt-2 z-50" onMouseEnter={() => handleMouseEnter(item.itemId)} onMouseLeave={handleMouseLeave}>
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-w-[300px]">
            {item.nodes.map((category, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-gray-800 font-semibold border-b pb-1">{category.name}</h3>
                <ul className="space-y-1">
                  {category.nodes.map((sub, idx) => (
                    <li key={idx} className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm">{sub.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-blue-900/95 backdrop-blur-md shadow-lg" : "bg-blue-800"}`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-blue-800 font-bold text-lg">NS</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Neural Semiconductor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {nodeList.map((item) => (
              <div key={item.itemId} onMouseEnter={() => handleMouseEnter(item.itemId)} onMouseLeave={handleMouseLeave} className="relative">
                <div className={`flex items-center px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg cursor-pointer ${activeMenu === item.itemId ? "bg-white/10" : ""}`}>
                  {item.name}
                  <FiChevronDown className="ml-1 w-4 h-4" />
                </div>
                {activeMenu === item.itemId && renderMegaMenu(item)}
              </div>
            ))}
            <Link href="/solutions" className="px-4 py-2 text-white hover:text-blue-200">Solutions</Link>
            <Link href="/support" className="px-4 py-2 text-white hover:text-blue-200">Support</Link>
            <Link href="/resources" className="px-4 py-2 text-white hover:text-blue-200">Resources</Link>
            <Link href="/about" className="px-4 py-2 text-white hover:text-blue-200">About</Link>
          </div>

          {/* User Auth & Actions */}
          <div className="relative flex items-center space-x-4">
            {session ? (
              <>
                <div className="relative">
                  <img
                    src={session.user?.image || "/default-user.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:shadow-lg"
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
                  className="hidden sm:block px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 shadow-md"
              >
                Sign In
              </button>
            )}

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
