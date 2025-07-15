// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Product from '../../../../models/Product';


// export async function GET() {
//   try {
//     await dbConnect();
    
//     console.log('=== DEBUGGING BRANDS ===');
    
//     // First, let's check what we have in the database
//     const totalCount = await Product.countDocuments();
//     console.log('Total products:', totalCount);
    
//     const activeCount = await Product.countDocuments({ isActive: { $ne: false } });
//     console.log('Active products:', activeCount);
    
//     const sampleProduct = await Product.findOne().lean();
//     console.log('Sample product fields:', Object.keys(sampleProduct || {}));
//     console.log('Sample product brand info:', {
//       brand: sampleProduct?.brand,
//       brandName: sampleProduct?.brandName
//     });
    
//     // Get distinct brands first to see what we have
//     const distinctBrands = await Product.distinct('brand');
//     const distinctBrandNames = await Product.distinct('brandName');
    
//     console.log('Distinct brands:', distinctBrands.slice(0, 10)); // Show first 10
//     console.log('Distinct brandNames:', distinctBrandNames.slice(0, 10)); // Show first 10
    
//     // Try multiple approaches to get brands
    
//     // Approach 1: Using static method (if available)
//     let brands = [];
//     try {
//       brands = await Product.getBrandsWithCounts();
//       console.log('Static method brands:', brands.slice(0, 5));
//     } catch (staticError) {
//       console.log('Static method failed, trying manual aggregation');
      
//       // Approach 2: Manual aggregation with flexible matching
//       brands = await Product.aggregate([
//         {
//           $match: {
//             $and: [
//               { isActive: { $ne: false } },
//               {
//                 $or: [
//                   { brand: { $exists: true, $ne: null, $ne: "" } },
//                   { brandName: { $exists: true, $ne: null, $ne: "" } }
//                 ]
//               }
//             ]
//           }
//         },
//         {
//           $group: {
//             _id: {
//               brand: '$brand',
//               brandName: '$brandName'
//             },
//             displayName: { 
//               $first: { 
//                 $cond: {
//                   if: { $ne: ['$brandName', null] },
//                   then: '$brandName',
//                   else: '$brand'
//                 }
//               }
//             },
//             brand: { $first: '$brand' },
//             brandName: { $first: '$brandName' },
//             count: { $sum: 1 }
//           }
//         },
//         {
//           $match: {
//             displayName: { $ne: null, $ne: "" }
//           }
//         },
//         {
//           $sort: { displayName: 1 }
//         }
//       ]);
//     }
    
//     console.log('Final brands result:', brands.slice(0, 5));
//     console.log('Total brands found:', brands.length);
//     console.log('=== END DEBUG ===');
    
//     return NextResponse.json({ 
//       success: true,
//       brands,
//       debug: {
//         totalCount,
//         activeCount,
//         sampleFields: Object.keys(sampleProduct || {}),
//         distinctBrandsCount: distinctBrands.length,
//         distinctBrandNamesCount: distinctBrandNames.length,
//         brandsFound: brands.length
//       }
//     });
    
//   } catch (error) {
//     console.error('Error fetching brands:', error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Failed to fetch brands', 
//         details: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    console.log('=== DEBUGGING BRANDS ===');
    const totalCount = await Product.countDocuments();
    console.log('Total products:', totalCount);

    const sampleProduct = await Product.findOne().lean();
    console.log('Sample product brand info:', {
      brand: sampleProduct?.brand,
      brandName: sampleProduct?.brandName,
    });

    const distinctBrands = await Product.distinct('brand');
    const distinctBrandNames = await Product.distinct('brandName');
    console.log('Distinct brands:', distinctBrands);
    console.log('Distinct brandNames:', distinctBrandNames);

    const brands = await Product.aggregate([
      {
        $match: {
          $or: [
            { brand: { $exists: true, $ne: null, $ne: '' } },
            { brandName: { $exists: true, $ne: null, $ne: '' } },
          ],
        },
      },
      {
        $group: {
          _id: { brand: '$brand', brandName: '$brandName' },
          displayName: {
            $first: { $ifNull: ['$brandName', '$brand'] },
          },
          count: { $sum: 1 },
        },
      },
      { $match: { displayName: { $ne: null, $ne: '' } } },
      { $sort: { displayName: 1 } },
    ]);

    console.log('Final brands result:', brands.slice(0, 5));
    console.log('Total brands found:', brands.length);

    return NextResponse.json({
      success: true,
      brands,
      debug: {
        totalCount,
        distinctBrandsCount: distinctBrands.length,
        distinctBrandNamesCount: distinctBrandNames.length,
        brandsFound: brands.length,
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands', details: error.message },
      { status: 500 }
    );
  }
}