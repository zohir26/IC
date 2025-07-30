// api/products/route.js - FIXED VERSION with POST route
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

// POST - Create new product
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('POST - Creating new product with data:', body);
    
    // Validate required fields
    const { name, type, category, price } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product name is required'
      }, { status: 400 });
    }
    
    if (!type || !type.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product type is required'
      }, { status: 400 });
    }
    
    if (!category || !category.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product category is required'
      }, { status: 400 });
    }
    
    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json({
        success: false,
        error: 'Valid price is required'
      }, { status: 400 });
    }
    
    // Check if product with this name already exists
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'A product with this name already exists'
      }, { status: 400 });
    }
    
    // Prepare product data with proper validation and cleaning
    const productData = {
      name: name.trim(),
      type: type.trim(),
      category: category.trim(),
      price: parseFloat(price),
      
      // Optional fields with defaults
      parentCategory: body.parentCategory?.trim() || '',
      brand: body.brand?.trim() || '',
      brandName: body.brandName?.trim() || '',
      manufacturer: body.manufacturer?.trim() || '',
      manufacturerName: body.manufacturerName?.trim() || '',
      availability: body.availability || 'In Stock',
      description: body.description?.trim() || '',
      image: body.image?.trim() || '',
      datasheet: body.datasheet?.trim() || '',
      videoUrl: body.videoUrl?.trim() || '',
      
      // Clean specifications - filter out empty keys/values
      specifications: Object.fromEntries(
        Object.entries(body.specifications || {})
          .filter(([key, value]) => key.trim() && value.trim())
          .map(([key, value]) => [key.trim(), value.trim()])
      ),
      
      // Clean applications - filter out empty strings
      applications: (body.applications || [])
        .filter(app => app && app.trim())
        .map(app => app.trim()),
      
      // Clean features - filter out empty strings
      features: (body.features || [])
        .filter(feature => feature && feature.trim())
        .map(feature => feature.trim()),
      
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating product with data:', productData);
    
    const product = await Product.create(productData);
    
    console.log('Product created successfully:', product);
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'A product with this information already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      details: error.message
    }, { status: 500 });
  }
}