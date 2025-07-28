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
    const sort = searchParams.get('sort') || 'name'; // Default sort by name
    const order = searchParams.get('order') || 'asc'; // Default ascending

    // Build query
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (parentCategory) query.parentCategory = parentCategory;

    if (brand.length > 0) {
      query.$or = [
        { brand: { $in: brand } },
        { brandName: { $in: brand } },
      ];
    }

    if (manufacturer.length > 0) {
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: [{ manufacturer: { $in: manufacturer } }, { manufacturerName: { $in: manufacturer } }] },
        ];
        delete query.$or;
      } else {
        query.$or = [
          { manufacturer: { $in: manufacturer } },
          { manufacturerName: { $in: manufacturer } },
        ];
      }
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    if (features.length > 0) {
      query.features = { $all: features };
    }

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
      ];
      if (query.$and) {
        query.$and.push({ $or: searchConditions });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const skip = (page - 1) * limit;
    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    const [products, totalCount] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortOption).lean(),
      Product.countDocuments(query),
    ]);

    console.log(`Found ${products.length} products out of ${totalCount} total`);

    if (products.length > 0) {
      console.log('Sample product:', {
        _id: products[0]._id,
        name: products[0].name,
        brand: products[0].brand,
        brandName: products[0].brandName,
        category: products[0].category,
        type: products[0].type,
        price: products[0].price,
      });
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
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', details: error.message },
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
    
//     // Handle price range
//     if (!isNaN(minPrice) || !isNaN(maxPrice)) {
//       query.unitPrice = {};
//       if (!isNaN(minPrice)) {
//         query.unitPrice.$gte = minPrice;
//       }
//       if (!isNaN(maxPrice)) {
//         query.unitPrice.$lte = maxPrice;
//       }
//     }
    
//     // Handle features filter (array)
//     if (features && features.length > 0) {
//       query.features = { $in: features };
//     }
    
//     // Handle search
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
      
//       // Combine with existing conditions
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
    
//     // Calculate skip for pagination
//     const skip = (page - 1) * limit;
    
//     // Execute query with pagination
//     const [products, totalCount] = await Promise.all([
//       Product.find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort({ productCode: 1 })
//         .lean(),
//       Product.countDocuments(query)
//     ]);
    
//     console.log(`Found ${products.length} products out of ${totalCount} total`);
    
//     // Sample log of first product to check structure
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