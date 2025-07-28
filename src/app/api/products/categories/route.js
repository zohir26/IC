// api/products/category/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    // Get the query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const manufacturer = searchParams.get('manufacturer');

    // Build the dynamic filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (brand) {
      filter.brand = brand;
    }
    if (manufacturer) {
      filter.manufacturer = manufacturer;
    }

    console.log('Dynamic filter:', filter);

    // Your existing aggregation pipeline, but with a dynamic $match stage
    const brands = await Product.aggregate([
      {
        $match: filter, // Use the dynamic filter here
      },
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

    // You can also get a list of distinct manufacturers or categories dynamically
    const manufacturers = await Product.distinct('manufacturer', filter);
    const categories = await Product.distinct('category', filter);

    console.log('Final brands result:', brands.slice(0, 5));
    console.log('Total brands found:', brands.length);

    return NextResponse.json({
      success: true,
      brands,
      manufacturers,
      categories,
      debug: {
        filterUsed: filter,
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




// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Product from '@/models/Product';

// export async function GET() {
//   try {
//     await dbConnect();
    
//     console.log('=== DEBUGGING CATEGORIES ===');
    
//     const totalCount = await Product.countDocuments();
//     console.log('Total products:', totalCount);
    
//     const sampleProduct = await Product.findOne().lean();
//     console.log('Sample product category info:', {
//       category: sampleProduct?.category,
//       parentCategory: sampleProduct?.parentCategory,
//       type: sampleProduct?.type
//     });
    
//     // Get distinct values
//     const distinctCategories = await Product.distinct('category');
//     const distinctParentCategories = await Product.distinct('parentCategory');
//     const distinctTypes = await Product.distinct('type');
    
//     console.log('Distinct categories:', distinctCategories.slice(0, 10));
//     console.log('Distinct parentCategories:', distinctParentCategories.slice(0, 10));
//     console.log('Distinct types:', distinctTypes.slice(0, 10));
    
//     // Try static method first, then fallback to manual aggregation
//     let categories = [];
//     try {
//       categories = await Product.getCategoriesWithCounts();
//       console.log('Static method categories:', categories.slice(0, 5));
//     } catch (staticError) {
//       console.log('Static method failed, trying manual aggregation');
      
//       categories = await Product.aggregate([
//         { 
//           $match: { 
//             category: { $exists: true, $ne: null, $ne: "" },
//             isActive: { $ne: false }
//           } 
//         },
//         {
//           $group: {
//             _id: {
//               parentCategory: '$parentCategory',
//               category: '$category',
//               type: '$type'
//             },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.parentCategory': 1, '_id.category': 1, '_id.type': 1 } }
//       ]);
//     }
    
//     console.log('Final categories result:', categories.slice(0, 5));
//     console.log('Total categories found:', categories.length);
//     console.log('=== END DEBUG ===');
    
//     return NextResponse.json({ 
//       success: true,
//       categories,
//       debug: {
//         totalCount,
//         distinctCategoriesCount: distinctCategories.length,
//         distinctParentCategoriesCount: distinctParentCategories.length,
//         distinctTypesCount: distinctTypes.length,
//         categoriesFound: categories.length
//       }
//     });
    
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Failed to fetch categories', 
//         details: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Product from '@/models/Product';

// export async function GET() {
//   try {
//     await dbConnect();

//     console.log('=== DEBUGGING CATEGORIES ===');
//     const totalCount = await Product.countDocuments();
//     console.log('Total products:', totalCount);

//     const sampleProduct = await Product.findOne().lean();
//     console.log('Sample product category info:', {
//       category: sampleProduct?.category,
//       parentCategory: sampleProduct?.parentCategory,
//       type: sampleProduct?.type,
//     });

//     const distinctCategories = await Product.distinct('category');
//     const distinctParentCategories = await Product.distinct('parentCategory');
//     const distinctTypes = await Product.distinct('type');
//     console.log('Distinct categories:', distinctCategories);
//     console.log('Distinct parentCategories:', distinctParentCategories);
//     console.log('Distinct types:', distinctTypes);

//     const categories = await Product.aggregate([
//       {
//         $match: {
//           category: { $exists: true, $ne: null, $ne: '' },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             parentCategory: '$parentCategory',
//             category: '$category',
//             type: '$type',
//           },
//           displayName: {
//             $first: { $ifNull: ['$category', '$type'] },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { '_id.parentCategory': 1, '_id.category': 1, '_id.type': 1 } },
//     ]);

//     console.log('Final categories result:', categories.slice(0, 5));
//     console.log('Total categories found:', categories.length);

//     return NextResponse.json({
//       success: true,
//       categories,
//       debug: {
//         totalCount,
//         distinctCategoriesCount: distinctCategories.length,
//         distinctParentCategoriesCount: distinctParentCategories.length,
//         distinctTypesCount: distinctTypes.length,
//         categoriesFound: categories.length,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch categories', details: error.message },
//       { status: 500 }
//     );
//   }
// }

