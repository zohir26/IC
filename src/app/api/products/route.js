// /api/products/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const parentCategory = searchParams.get('parentCategory');
    const brand = searchParams.getAll('brand');
    const manufacturer = searchParams.getAll('manufacturer');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const features = searchParams.getAll('features');
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';

    console.log('=== PRODUCTS API DEBUG ===');
    console.log('Received parameters:', {
      type,
      category,
      parentCategory,
      brand,
      manufacturer,
      search,
      page,
      limit,
      sort,
      order
    });

    // Build query
    const query = {};

    // Category filtering - exact match
    if (category) {
      query.category = category;
      console.log('Category filter applied:', category);
    }

    // Type filtering
    if (type) {
      query.type = type;
      console.log('Type filter applied:', type);
    }

    // Parent category filtering
    if (parentCategory) {
      query.parentCategory = parentCategory;
      console.log('Parent category filter applied:', parentCategory);
    }

    // Brand filtering - handle both brand and brandName fields
    if (brand.length > 0) {
      query.$or = [
        { brand: { $in: brand } },
        { brandName: { $in: brand } },
      ];
      console.log('Brand filter applied:', brand);
    }

    // Manufacturer filtering - handle both manufacturer and manufacturerName fields
    if (manufacturer.length > 0) {
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: [
            { manufacturer: { $in: manufacturer } },
            { manufacturerName: { $in: manufacturer } }
          ] },
        ];
        delete query.$or;
      } else {
        query.$or = [
          { manufacturer: { $in: manufacturer } },
          { manufacturerName: { $in: manufacturer } },
        ];
      }
      console.log('Manufacturer filter applied:', manufacturer);
    }

    // Price range filtering
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
      console.log('Price filter applied:', query.price);
    }

    // Features filtering
    if (features.length > 0) {
      query.features = { $all: features };
      console.log('Features filter applied:', features);
    }

    // Search functionality
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchConditions = [
        { name: searchRegex },
        { brand: searchRegex },
        { brandName: searchRegex },
        { manufacturer: searchRegex },
        { manufacturerName: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
        { 'specifications.architecture': searchRegex },
        { features: { $in: [searchRegex] } },
        { applications: { $in: [searchRegex] } }
      ];

      if (query.$and) {
        query.$and.push({ $or: searchConditions });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
      console.log('Search filter applied for:', search);
    }

    console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    console.log('Pagination:', { skip, limit, sort: sortOption });

    // Execute queries
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .lean(),
      Product.countDocuments(query),
    ]);

    console.log('Query results:', {
      productsFound: products.length,
      totalCount,
      hasResults: products.length > 0
    });

    // Log sample products for debugging
    if (products.length > 0) {
      console.log('Sample products:', products.slice(0, 2).map(p => ({
        name: p.name,
        category: p.category,
        brand: p.brand,
        brandName: p.brandName,
        manufacturer: p.manufacturer,
        manufacturerName: p.manufacturerName,
        price: p.price
      })));
    } else {
      console.log('No products found with current filters');
      
      // Debug: Check if any products exist in the collection
      const anyProducts = await Product.countDocuments();
      console.log('Total products in collection:', anyProducts);
      
      // Check if products exist with just category filter
      if (category) {
        const categoryProducts = await Product.countDocuments({ category });
        console.log(`Products with category "${category}":`, categoryProducts);
        
        // Check for similar categories
        const allCategories = await Product.distinct('category');
        console.log('All available categories:', allCategories);
      }
    }

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
      debug: {
        query,
        totalProducts: totalCount,
        returnedProducts: products.length
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// app/api/products/route.js
// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017';
// let client;
// let clientPromise;

// if (!global._mongoClientPromise) {
//   client = new MongoClient(uri);
//   global._mongoClientPromise = client.connect();
// }
// clientPromise = global._mongoClientPromise;

// export async function GET(request) {
//   try {
//     const mongoClient = await clientPromise;
//     const db = mongoClient.db('IC');
//     const collection = db.collection('products');

//     const { searchParams } = new URL(request.url);
//     const filter = {};
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '10', 10);
//     const skip = (page - 1) * limit;

//     // Build the filter object based on query parameters
//     const category = searchParams.get('category');
//     const brand = searchParams.get('brand');
//     const manufacturer = searchParams.get('manufacturer');

//     if (category) {
//       filter.category = category;
//     }
//     if (brand) {
//       filter.brand = brand;
//     }
//     if (manufacturer) {
//       filter.manufacturer = manufacturer;
//     }
//     // You can add more filters here, for example:
//     // const search = searchParams.get('q');
//     // if (search) {
//     //   filter.$text = { $search: search };
//     // }

//     // Get total count for pagination
//     const totalCount = await collection.countDocuments(filter);

//     const products = await collection.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     return NextResponse.json({
//       products,
//       pagination: {
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//         limit,
//       },
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch products' },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Product from '@/models/Product';

// export async function GET(request) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(request.url);
    
//     // Extract query parameters
//     const type = searchParams.get('type');
//     const category = searchParams.get('category');
//     const parentCategory = searchParams.get('parentCategory');
//     const brand = searchParams.getAll('brand'); // Use getAll for arrays
//     const manufacturer = searchParams.getAll('manufacturer'); // Use getAll for arrays
//     const search = searchParams.get('search');
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 20;
//     const minPrice = parseFloat(searchParams.get('minPrice'));
//     const maxPrice = parseFloat(searchParams.get('maxPrice'));
//     const features = searchParams.getAll('features'); // Use getAll for arrays
    
//     // Build query
//     const query = { isActive: { $ne: false } };
    
//     if (type) {
//       query.type = type;
//     }
    
//     if (category) {
//       query.category = category;
//     }
    
//     if (parentCategory) {
//       query.parentCategory = parentCategory;
//     }
    
//     // Handle brand filter (array)
//     if (brand && brand.length > 0) {
//       query.$or = [
//         { brand: { $in: brand } },
//         { brandName: { $in: brand } }
//       ];
//     }
    
//     // Handle manufacturer filter (array)
//     if (manufacturer && manufacturer.length > 0) {
//       // If we already have $or from brand, we need to combine them
//       if (query.$or) {
//         query.$and = [
//           { $or: query.$or },
//           { $or: [
//             { manufacturer: { $in: manufacturer } },
//             { manufacturerName: { $in: manufacturer } }
//           ]}
//         ];
//         delete query.$or;
//       } else {
//         query.$or = [
//           { manufacturer: { $in: manufacturer } },
//           { manufacturerName: { $in: manufacturer } }
//         ];
//       }
//     }
    
// //     // Handle price range
//     if (!isNaN(minPrice) || !isNaN(maxPrice)) {
//       query.unitPrice = {};
//       if (!isNaN(minPrice)) {
//         query.unitPrice.$gte = minPrice;
//       }
//       if (!isNaN(maxPrice)) {
//         query.unitPrice.$lte = maxPrice;
//       }
//     }
    
// //     // Handle features filter (array)
//     if (features && features.length > 0) {
//       query.features = { $in: features };
//     }
    
// //     // Handle search
//     if (search) {
//       const searchRegex = { $regex: search, $options: 'i' };
//       const searchConditions = [
//         { productCode: searchRegex },
//         { description: searchRegex },
//         { brand: searchRegex },
//         { brandName: searchRegex },
//         { manufacturer: searchRegex },
//         { manufacturerName: searchRegex },
//         { category: searchRegex },
//         { type: searchRegex }
//       ];
      
// //       // Combine with existing conditions
//       if (query.$and) {
//         query.$and.push({ $or: searchConditions });
//       } else if (query.$or) {
//         query.$and = [
//           { $or: query.$or },
//           { $or: searchConditions }
//         ];
//         delete query.$or;
//       } else {
//         query.$or = searchConditions;
//       }
//     }
    
//     console.log('Final query:', JSON.stringify(query, null, 2));
    
// //     // Calculate skip for pagination
//     const skip = (page - 1) * limit;
    
// //     // Execute query with pagination
//     const [products, totalCount] = await Promise.all([
//       Product.find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort({ productCode: 1 })
//         .lean(),
//       Product.countDocuments(query)
//     ]);
    
//     console.log(`Found ${products.length} products out of ${totalCount} total`);
    
// //     // Sample log of first product to check structure
//     if (products.length > 0) {
//       console.log('Sample product:', {
//         _id: products[0]._id,
//         productCode: products[0].productCode,
//         brand: products[0].brand,
//         brandName: products[0].brandName,
//         category: products[0].category,
//         type: products[0].type,
//         unitPrice: products[0].unitPrice
//       });
//     }
    
//     return NextResponse.json({
//       success: true,
//       products,
//       pagination: {
//         page,
//         limit,
//         totalPages: Math.ceil(totalCount / limit),
//         totalCount
//       }
//     });
    
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Failed to fetch products',
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }