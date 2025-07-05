"use client"
import Link from 'next/link';

const brands = [
  { id: 1, name: "muRata", logo: "https://i.ibb.co/BVjnJ1Gn/muratea-removebg-preview.png", link: "/brands/murata" },
  { id: 2, name: "Positronic", logo: "https://i.ibb.co/XkdXc5Y9/Positronic.png", link: "/brands/positronic" },
  { id: 3, name: "Microchip", logo: "https://i.ibb.co/TM8qdZLN/microchip-removebg-preview.png", link: "/brands/microchip" },
  { id: 4, name: "Littelfuse", logo: "https://i.ibb.co/9Hx7xKMK/lettelfuse-removebg-preview.png", link: "/brands/littelfuse" },
  { id: 5, name: "Diodes", logo: "https://i.ibb.co/BKZ2d6Dr/diodes-removebg-preview.png", link: "/brands/diodes" },
  { id: 6, name: "Allegro", logo: "https://i.ibb.co/VYK54kRJ/allergo-removebg-preview.png", link: "/brands/allegro" },
  { id: 7, name: "NXP", logo: "https://i.ibb.co/HfzDSJ0v/nxp-removebg-preview.png", link: "/brands/nxp" },
  { id: 8, name: "CuDevices", logo: "https://i.ibb.co/JJDz9Pq/CUdevices-removebg-preview.png", link: "/brands/oudevices" },
  { id: 9, name: "Toshiba", logo: "https://i.ibb.co/tT9PDsHM/tosibha-removebg-preview.png", link: "/brands/toshiba" },
  { id: 10, name: "Advantech", logo: "https://i.ibb.co/CpT6HPLX/adhntech-removebg-preview.png", link: "/brands/advantech" },
  { id: 11, name: "Analog Devices", logo: "https://i.ibb.co/60qszrR9/analog-devies-removebg-preview.png", link: "/brands/analog-devices" },
  { id: 12, name: "Texas Instruments", logo: "https://i.ibb.co/nGjLhhd/texas-removebg-preview.png", link: "/brands/texas-instruments" },
  { id: 13, name: "ST", logo: "https://i.ibb.co/9kYDg4F5/ST-removebg-preview.png", link: "/brands/st" },
  { id: 14, name: "Onsemi", logo: "https://i.ibb.co/0VKfQRXz/onsemi-removebg-preview.png", link: "/brands/onsemi" },
  { id: 15, name: "ROHM", logo: "https://i.ibb.co/PvSBvCd2/rohm-removebg-preview.png", link: "/brands/rohm" },
  { id: 16, name: "Renesas", logo: "https://i.ibb.co/wFw0N0f0/renesas-removebg-preview.png", link: "/brands/renesas" },
  { id: 17, name: "Sgmicro", logo: "https://i.ibb.co/fY1P85N6/sgmicro-removebg-preview.png", link: "/brands/sgmicro" },
  { id: 18, name: "Brocade", logo: "https://i.ibb.co/vCdnG5jq/brocade-removebg-preview.png", link: "/brands/brocade" },
  { id: 19, name: "Kemet", logo: "https://i.ibb.co/sz47NJH/kemet-removebg-preview.png", link: "/brands/kemet" },
  { id: 20, name: "Vishay", logo: "https://i.ibb.co/XfZRYSdZ/vishay-removebg-preview.png", link: "/brands/vishay" },
  { id: 21, name: "Apex", logo: "https://i.ibb.co/LdSCPzCC/apex-removebg-preview.png", link: "/brands/apex" }
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