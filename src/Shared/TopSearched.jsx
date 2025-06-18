"use client"
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from "@/components/ui/button";

const searchedItems = [
  {
    id: 1,
    category: "ZENER DIODES",
    partNumber: "BZX84WC15V",
    status: "ACTIVE",
    description: "15V Zener diode in SC-70 package",
    price: "1ku | 0.02",
    icon: "https://i.ibb.co/BKZ2d6Dr/diodes-removebg-preview.png"
  },
  {
    id: 2,
    category: "COMPARATORS",
    partNumber: "TLV3511-Q1",
    status: "ACTIVE",
    description: "Automotive low-power comparator with rail-to-rail inputs",
    price: "1ku | 0.65",
    icon: "https://i.ibb.co/S4VyNBS0/connector-removebg-preview.png"
  },
  {
    id: 3,
    category: "BLDC DRIVERS",
    partNumber: "DRV8376-Q1",
    status: "ACTIVE",
    description: "Automotive 12V/24V, 40V max, 4A peak three-phase motor driver with integrated current sensing",
    price: "1ku | 1.50",
    icon: "https://i.ibb.co/jkdfC6dB/drivers-removebg-preview.png"
  },
  {
    id: 4,
    category: "MICROCONTROLLERS",
    partNumber: "STM32F407VG",
    status: "ACTIVE",
    description: "High-performance ARM Cortex-M4 32-bit RISC core",
    price: "1ku | 8.45",
    icon: "https://i.ibb.co/chk7G2xR/microcontroller-removebg-preview.png"
  },
  {
    id: 5,
    category: "POWER MANAGEMENT",
    partNumber: "LM2596S-5.0",
    status: "ACTIVE",
    description: "Simple Switcher Power Converter 150 kHz 3A Step-Down Voltage Regulator",
    price: "1ku | 2.30",
    icon: "https://i.ibb.co/b5ZnCw66/power-management-removebg-preview.png"
  },
  {
    id: 6,
    category: "RF MODULES",
    partNumber: "ESP32-WROOM-32",
    status: "ACTIVE",
    description: "WiFi+BT+BLE MCU Module",
    price: "1ku | 3.20",
    icon: "https://i.ibb.co/spvQf45V/modules-removebg-preview.png"
  }
];

export default function TopSearched() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= searchedItems.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, searchedItems.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const visibleItems = searchedItems.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Headers */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Recently Added */}
          {/* <div className="flex-1">
            <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
              <h2 className="text-xl md:text-2xl font-bold transform skew-x-12">RECENTLY ADDED</h2>
            </div>
          </div> */}
          
          {/* Top Searched */}
          <div className="flex-1">
            <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
              <h2 className="text-xl md:text-2xl font-bold transform skew-x-12">TOP SEARCHED</h2>
            </div>
          </div>
        </div>

        {/* Navigation and Cards */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="sm"
              className="p-2 rounded-full"
              disabled={currentIndex === 0}
            >
              <FiChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={nextSlide}
              variant="outline"
              size="sm"
              className="p-2 rounded-full"
              disabled={currentIndex + itemsPerPage >= searchedItems.length}
            >
              <FiChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={item.icon} 
                        alt={item.category}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.partNumber}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Approx. price (USD) {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(searchedItems.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}