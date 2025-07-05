"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { FiSearch } from 'react-icons/fi';

export default function Banner() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background with gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"> */}
      <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: "url('/IC banner.jpg')"}}>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-cyan-400 rounded-full opacity-30 blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-25 blur-md"></div>
        
        {/* Circuit board pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/3 w-64 h-64 border border-blue-300 rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-cyan-300 rounded-lg transform -rotate-6"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 flex justify-center items-center">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Heading */}
          <div className="space-y-4 flex flex-col justify-center items-center py-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Unlock the Best Chips for Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Design
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Comprehensive Tech Specs - Behind Every Perfect Pick
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white rounded-lg shadow-2xl overflow-hidden">
                <Input
                  type="text"
                  placeholder="Search by part number or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 text-lg border-0 focus:ring-0 focus:outline-none placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-none h-auto text-lg font-semibold transition-colors duration-200"
                >
                  <FiSearch className="w-5 h-5 mr-2" />
                  SEARCH
                </Button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>10M+ Components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>1000+ Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time Pricing</span>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}