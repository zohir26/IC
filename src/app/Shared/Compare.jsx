"use client"
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { FiSearch } from 'react-icons/fi';

export default function CompareSection() {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">COMPARE</h2>
          </div>
        </div>

        {/* Compare Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* First Compare Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">COMPARE WITH</h3>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery1}
                onChange={(e) => setSearchQuery1(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Second Compare Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">COMPARE WITH</h3>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery2}
                onChange={(e) => setSearchQuery2(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}