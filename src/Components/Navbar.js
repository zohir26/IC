// "use client";
// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function Navbar() {
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNavData = async () => {
//       try {
//         setLoading(true);
//         const [categoriesRes, brandsRes, manufacturersRes] = await Promise.all([
//           fetch('/api/products/categories'),
//           fetch('/api/products/brands'),
//           fetch('/api/products/manufacturers'),
//         ]);

//         const categoriesData = await categoriesRes.json();
//         const brandsData = await brandsRes.json();
//         const manufacturersData = await manufacturersRes.json();

//         setCategories(categoriesData.categories || []);
//         setBrands(brandsData.brands || []);
//         setManufacturers(manufacturersData.manufacturers || []);
//       } catch (error) {
//         console.error('Error fetching nav data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNavData();
//   }, []);

//   return (
//     <nav className="bg-white shadow-md fixed top-0 w-full z-10">
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="text-2xl font-bold text-gray-900">
//             IC Store
//           </Link>
//           <div className="flex space-x-4">
//             <div className="relative group">
//               <button className="text-gray-700 hover:text-blue-600">Categories</button>
//               <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-4 min-w-[200px]">
//                 {loading ? (
//                   <p>Loading...</p>
//                 ) : categories.length > 0 ? (
//                   categories.map((cat) => (
//                     <Link
//                       key={cat._id.category}
//                       href={`/products/category/${cat._id.category}`}
//                       className="block py-2 text-gray-700 hover:text-blue-600 capitalize"
//                     >
//                       {cat._id.category.replace(/-/g, ' ')} ({cat.count})
//                     </Link>
//                   ))
//                 ) : (
//                   <p>No categories available</p>
//                 )}
//               </div>
//             </div>
//             <div className="relative group">
//               <button className="text-gray-700 hover:text-blue-600">Brands</button>
//               <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-4 min-w-[200px]">
//                 {loading ? (
//                   <p>Loading...</p>
//                 ) : brands.length > 0 ? (
//                   brands.map((brand) => (
//                     <Link
//                       key={brand._id.brand}
//                       href={`/products/brand/${brand._id.brand}`}
//                       className="block py-2 text-gray-700 hover:text-blue-600"
//                     >
//                       {brand.displayName} ({brand.count})
//                     </Link>
//                   ))
//                 ) : (
//                   <p>No brands available</p>
//                 )}
//               </div>
//             </div>
//             <div className="relative group">
//               <button className="text-gray-700 hover:text-blue-600">Manufacturers</button>
//               <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-4 min-w-[200px]">
//                 {loading ? (
//                   <p>Loading...</p>
//                 ) : manufacturers.length > 0 ? (
//                   manufacturers.map((mfg) => (
//                     <Link
//                       key={mfg._id.manufacturer}
//                       href={`/products/manufacturer/${mfg._id.manufacturer}`}
//                       className="block py-2 text-gray-700 hover:text-blue-600"
//                     >
//                       {mfg.displayName} ({mfg.count})
//                     </Link>
//                   ))
//                 ) : (
//                   <p>No manufacturers available</p>
//                 )}
//               </div>
//             </div>
//             <Link href="/products" className="text-gray-700 hover:text-blue-600">
//               All Products
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }