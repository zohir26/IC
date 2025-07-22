// "use client"
// import Link from 'next/link';

// const brands = [
//   { id: 1, name: "muRata", logo: "https://i.ibb.co/BVjnJ1Gn/muratea-removebg-preview.png", link: "/brands/murata" },
//   { id: 2, name: "Positronic", logo: "https://i.ibb.co/XkdXc5Y9/Positronic.png", link: "/brands/positronic" },
//   { id: 3, name: "Microchip", logo: "https://i.ibb.co/TM8qdZLN/microchip-removebg-preview.png", link: "/brands/microchip" },
//   { id: 4, name: "Littelfuse", logo: "https://i.ibb.co/9Hx7xKMK/lettelfuse-removebg-preview.png", link: "/brands/littelfuse" },
//   { id: 5, name: "Diodes", logo: "https://i.ibb.co/BKZ2d6Dr/diodes-removebg-preview.png", link: "/brands/diodes" },
//   { id: 6, name: "Allegro", logo: "https://i.ibb.co/VYK54kRJ/allergo-removebg-preview.png", link: "/brands/allegro" },
//   { id: 7, name: "NXP", logo: "https://i.ibb.co/HfzDSJ0v/nxp-removebg-preview.png", link: "/brands/nxp" },
//   { id: 8, name: "CuDevices", logo: "https://i.ibb.co/JJDz9Pq/CUdevices-removebg-preview.png", link: "/brands/oudevices" },
//   { id: 9, name: "Toshiba", logo: "https://i.ibb.co/tT9PDsHM/tosibha-removebg-preview.png", link: "/brands/toshiba" },
//   { id: 10, name: "Advantech", logo: "https://i.ibb.co/CpT6HPLX/adhntech-removebg-preview.png", link: "/brands/advantech" },
//   { id: 11, name: "Analog Devices", logo: "https://i.ibb.co/60qszrR9/analog-devies-removebg-preview.png", link: "/brands/analog-devices" },
//   { id: 12, name: "Texas Instruments", logo: "https://i.ibb.co/nGjLhhd/texas-removebg-preview.png", link: "/brands/texas-instruments" },
//   { id: 13, name: "ST", logo: "https://i.ibb.co/9kYDg4F5/ST-removebg-preview.png", link: "/brands/st" },
//   { id: 14, name: "Onsemi", logo: "https://i.ibb.co/0VKfQRXz/onsemi-removebg-preview.png", link: "/brands/onsemi" },
//   { id: 15, name: "ROHM", logo: "https://i.ibb.co/PvSBvCd2/rohm-removebg-preview.png", link: "/brands/rohm" },
//   { id: 16, name: "Renesas", logo: "https://i.ibb.co/wFw0N0f0/renesas-removebg-preview.png", link: "/brands/renesas" },
//   { id: 17, name: "Sgmicro", logo: "https://i.ibb.co/fY1P85N6/sgmicro-removebg-preview.png", link: "/brands/sgmicro" },
//   { id: 18, name: "Brocade", logo: "https://i.ibb.co/vCdnG5jq/brocade-removebg-preview.png", link: "/brands/brocade" },
//   { id: 19, name: "Kemet", logo: "https://i.ibb.co/sz47NJH/kemet-removebg-preview.png", link: "/brands/kemet" },
//   { id: 20, name: "Vishay", logo: "https://i.ibb.co/XfZRYSdZ/vishay-removebg-preview.png", link: "/brands/vishay" },
//   { id: 21, name: "Apex", logo: "https://i.ibb.co/LdSCPzCC/apex-removebg-preview.png", link: "/brands/apex" }
// ];

// export default function FindByBrands() {
//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="relative mb-12">
//           <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
//             <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">FIND BY BRANDS</h2>
//           </div>
//         </div>

//         {/* Brands Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//           {brands.map((brand) => (
//             <Link key={brand.id} href={brand.link}>
//               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group cursor-pointer">
//                 <div className="flex items-center justify-center h-16">
//                   <img 
//                     src={brand.logo} 
//                     alt={brand.name}
//                     className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
//                   />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { api, slugify } from '@/lib/utils';

export default function FindByBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/brands');
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading Manufacturers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Brands</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchBrands}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-12">
          <div className="bg-blue-800 text-white px-8 py-4 inline-block transform -skew-x-12">
            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">Manufacturers</h2>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {brands.map((brand) => (
            <Link key={brand.brandId} href={`/brands/${slugify(brand.name)}`}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center justify-center h-16 mb-2">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-medium text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands found</p>
          </div>
        )}
      </div>
    </section>
  );
}