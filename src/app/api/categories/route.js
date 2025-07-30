// api/categories/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET(request) {
  try {
    await dbConnect();
    
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'subcategories.name': { $regex: search, $options: 'i' } },
          { 'details.description': { $regex: search, $options: 'i' } }
        ]
      };
    }

    let categoriesQuery = Category.find(query).sort({ id: 1 });
    
    // Add pagination if limit is provided
    if (limit) {
      const limitNum = parseInt(limit);
      const skip = (parseInt(page) - 1) * limitNum;
      categoriesQuery = categoriesQuery.skip(skip).limit(limitNum);
    }

    const categories = await categoriesQuery.lean();
    
    // Get total count for pagination
    const totalCount = await Category.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: categories,
      categories: categories, // Also include in categories field for compatibility
      pagination: limit ? {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      } : null
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('POST - Creating new category with data:', body);
    
    // Validate required fields
    const { name, icon, link } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 });
    }
    
    if (!icon || !icon.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category icon URL is required'
      }, { status: 400 });
    }
    
    if (!link || !link.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category link is required'
      }, { status: 400 });
    }
    
    // Check if category with this name already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'A category with this name already exists'
      }, { status: 400 });
    }
    
    // Get the next category ID
    const lastCategory = await Category.findOne({}, {}, { sort: { id: -1 } });
    const nextId = lastCategory ? lastCategory.id + 1 : 1;
    
    // Prepare category data with proper validation
    const categoryData = {
      id: nextId,
      name: name.trim(),
      icon: icon.trim(),
      link: link.trim(),
      
      // Process subcategories - ensure all required fields
      subcategories: (body.subcategories || [])
        .filter(sub => sub.name && sub.name.trim() && sub.description && sub.description.trim() && sub.link && sub.link.trim())
        .map((sub, index) => ({
          id: sub.id || (nextId * 100 + index + 1),
          name: sub.name.trim(),
          description: sub.description.trim(),
          link: sub.link.trim()
        })),
      
      // Process top manufacturers - ensure all required fields
      topManufacturers: (body.topManufacturers || [])
        .filter(mfg => mfg.name && mfg.name.trim() && mfg.logo && mfg.logo.trim() && mfg.website && mfg.website.trim())
        .map((mfg, index) => ({
          id: mfg.id || (nextId * 1000 + index + 1),
          name: mfg.name.trim(),
          logo: mfg.logo.trim(),
          specialties: Array.isArray(mfg.specialties) 
            ? mfg.specialties.filter(spec => spec && spec.trim()).map(spec => spec.trim())
            : [],
          website: mfg.website.trim()
        })),
      
      // Process popular parts - ensure all required fields
      popularParts: (body.popularParts || [])
        .filter(part => 
          part.partNumber && part.partNumber.trim() && 
          part.manufacturer && part.manufacturer.trim() && 
          part.category && part.category.trim() && 
          part.description && part.description.trim() && 
          part.image && part.image.trim() && 
          part.price && part.price.trim() && 
          part.link && part.link.trim()
        )
        .map((part, index) => ({
          id: part.id || (nextId * 10000 + index + 1),
          partNumber: part.partNumber.trim(),
          manufacturer: part.manufacturer.trim(),
          category: part.category.trim(),
          description: part.description.trim(),
          image: part.image.trim(),
          price: part.price.trim(),
          inStock: Boolean(part.inStock),
          popularity: part.popularity ? Math.min(100, Math.max(0, parseInt(part.popularity))) : 50,
          link: part.link.trim()
        })),
      
      // Process details - provide defaults for required fields
      details: {
        description: (body.details?.description || '').trim() || 'Default category description',
        applications: (body.details?.applications || [])
          .filter(app => app && app.trim())
          .map(app => app.trim()),
        keyFeatures: (body.details?.keyFeatures || [])
          .filter(feature => feature && feature.trim())
          .map(feature => feature.trim()),
        marketInfo: (body.details?.marketInfo || '').trim() || 'Market information not available'
      }
    };
    
    console.log('Creating category with processed data:', categoryData);
    
    const category = await Category.create(categoryData);
    
    console.log('Category created successfully:', category);
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
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
        error: 'A category with this information already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create category',
      details: error.message
    }, { status: 500 });
  }
}