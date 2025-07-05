"use client"
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const recentlyViewedItems = [
  {
    id: 1,
    name: "UMultilink",
    description: "Universal Multilink Development Interface",
    image: "https://i.ibb.co/m5CcLqzw/u-multilink-removebg-preview.png",
    link: "/products/umultilink"
  },
  {
    id: 2,
    name: "i.MX-RT600",
    description: "i.MX RT600 Crossover MCU with Arm® Cortex®-M33",
    image: "https://i.ibb.co/hRTpZ8LB/i-mx-RT600-removebg-preview.png",
    link: "/products/imx-rt600"
  
  },
  {
    id: 3,
    name: "LPC1224FBD48",
    description: "32 KB Flash, 4 KB SRAM, LQFP48 Package",
    image: "https://i.ibb.co/YTNfVFVH/LPC1224-FBD48-removebg-preview.png",
    ink: "/products/lpc1224fbd48"
  }
];

export default function RecentlyViewed() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">RECENTLY VIEWED</h2>
          </div>
        </div>

        {/* Recently Viewed Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentlyViewedItems.map((item) => (
            <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`item.link`}>
                    <h3 className="text-xl font-bold text-blue-600 hover:text-blue-800 mb-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded">
                BUY OPTIONS
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}