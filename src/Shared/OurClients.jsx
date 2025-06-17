"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const clients = [
  { id: 1, name: "TSMC", logo: "/api/placeholder/120/60" },
  { id: 2, name: "Apple", logo: "/api/placeholder/120/60" },
  { id: 3, name: "GlobalFoundries", logo: "/api/placeholder/120/60" },
  { id: 4, name: "Samsung", logo: "/api/placeholder/120/60" },
  { id: 5, name: "Intel", logo: "/api/placeholder/120/60" },
  { id: 6, name: "AMD", logo: "/api/placeholder/120/60" },
  { id: 7, name: "NVIDIA", logo: "/api/placeholder/120/60" },
  { id: 8, name: "Qualcomm", logo: "/api/placeholder/120/60" }
];

export default function OurClients() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getVisibleClients = () => {
    const visibleCount = 3;
    const result = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % clients.length;
      result.push(clients[index]);
    }
    
    return result;
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">OUR CLIENTS</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Experience */}
            <div className="text-center md:text-left">
              <div className="mb-6">
                <span className="text-6xl md:text-8xl font-bold text-gray-800 block leading-none">
                  18
                </span>
                <p className="text-lg md:text-xl text-gray-600 mt-2">
                  Years of Experience
                </p>
              </div>
            </div>

            {/* Right Side - Client Logos Carousel */}
            <div className="relative">
              <div 
                className="flex items-center justify-center gap-8 transition-transform duration-500 ease-in-out"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {getVisibleClients().map((client, index) => (
                  <div 
                    key={`${client.id}-${currentIndex}-${index}`}
                    className={`transition-all duration-500 ${
                      index === 1 
                        ? 'scale-110 opacity-100' 
                        : 'scale-90 opacity-70'
                    }`}
                  >
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                      <img 
                        src={client.logo} 
                        alt={client.name}
                        className="h-12 w-auto mx-auto object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explore More Button */}
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-2 rounded-lg font-semibold"
                >
                  EXPLORE MORE
                </Button>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {clients.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index
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