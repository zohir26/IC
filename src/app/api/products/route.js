import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';


export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Base filter for active products
    let filter = { 
      isActive: { $ne: false }, // Handle both true and null/undefined as active
      isAvailable: { $ne: false } // Also check availability if field exists
    };
    
    // Use getAll to correctly handle multiple selections for a filter
    const types = searchParams.getAll('type');
    const categories = searchParams.getAll('category');
    const parentCategories = searchParams.getAll('parentCategory');
    const brands = searchParams.getAll('brand');
    const manufacturers = searchParams.getAll('manufacturer');
    const features = searchParams.getAll('features');
    
    // Build filter object using MongoDB's $in for arrays
    if (types.length > 0) {
      filter.type = { $in: types };
    }
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }
    if (parentCategories.length > 0) {
      filter.parentCategory = { $in: parentCategories };
    }
    if (brands.length > 0) {
      // Handle both brand and brandName fields
      filter.$or = [
        { brand: { $in: brands } },
        { brandName: { $in: brands } }
      ];
    }
    if (manufacturers.length > 0) {
      // Handle both manufacturer and manufacturerName fields
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: [
            { manufacturer: { $in: manufacturers } },
            { manufacturerName: { $in: manufacturers } }
          ]}
        ];
        delete filter.$or;
      } else {
        filter.$or = [
          { manufacturer: { $in: manufacturers } },
          { manufacturerName: { $in: manufacturers } }
        ];
      }
    }
    if (features.length > 0) {
      filter.features = { $in: features };
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Text search
    const search = searchParams.get('search');
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100); // Cap at 100
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
    const sortObj = {};
    
    // Handle different sort options
    switch (sortBy) {
      case 'price':
        sortObj.price = sortOrder;
        break;
      case 'rating':
        sortObj.rating = sortOrder;
        break;
      case 'date':
        sortObj.createdAt = sortOrder;
        break;
      default:
        sortObj.name = sortOrder;
    }
    
    // Add text search score sorting if searching
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    }
    
    console.log('Products filter:', JSON.stringify(filter, null, 2));
    
    // Execute query
    const products = await Product
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()
      .select('-__v'); // Exclude version field
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        skip
      },
      filter: filter // Include filter in response for debugging
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