"use client"
import Link from 'next/link';

const brands = [
  { id: 1, name: "muRata", logo: "/api/placeholder/140/80", link: "/brands/murata" },
  { id: 2, name: "Positronic", logo: "/api/placeholder/140/80", link: "/brands/positronic" },
  { id: 3, name: "Microchip", logo: "/api/placeholder/140/80", link: "/brands/microchip" },
  { id: 4, name: "Littelfuse", logo: "/api/placeholder/140/80", link: "/brands/littelfuse" },
  { id: 5, name: "Diodes", logo: "/api/placeholder/140/80", link: "/brands/diodes" },
  { id: 6, name: "Allegro", logo: "/api/placeholder/140/80", link: "/brands/allegro" },
  { id: 7, name: "NXP", logo: "/api/placeholder/140/80", link: "/brands/nxp" },
  { id: 8, name: "OuDevices", logo: "/api/placeholder/140/80", link: "/brands/oudevices" },
  { id: 9, name: "Toshiba", logo: "/api/placeholder/140/80", link: "/brands/toshiba" },
  { id: 10, name: "Advantech", logo: "/api/placeholder/140/80", link: "/brands/advantech" },
  { id: 11, name: "Analog Devices", logo: "/api/placeholder/140/80", link: "/brands/analog-devices" },
  { id: 12, name: "Texas Instruments", logo: "/api/placeholder/140/80", link: "/brands/texas-instruments" },
  { id: 13, name: "ST", logo: "/api/placeholder/140/80", link: "/brands/st" },
  { id: 14, name: "Onsemi", logo: "/api/placeholder/140/80", link: "/brands/onsemi" },
  { id: 15, name: "ROHM", logo: "/api/placeholder/140/80", link: "/brands/rohm" },
  { id: 16, name: "Renesas", logo: "/api/placeholder/140/80", link: "/brands/renesas" },
  { id: 17, name: "Sgmicro", logo: "/api/placeholder/140/80", link: "/brands/sgmicro" },
  { id: 18, name: "Brocade", logo: "/api/placeholder/140/80", link: "/brands/brocade" },
  { id: 19, name: "Kemet", logo: "/api/placeholder/140/80", link: "/brands/kemet" },
  { id: 20, name: "Vishay", logo: "/api/placeholder/140/80", link: "/brands/vishay" },
  { id: 21, name: "Apex", logo: "/api/placeholder/140/80", link: "/brands/apex" }
];

export default function FindByBrands() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">FIND BY BRANDS</h2>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={brand.link}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center justify-center h-16">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}