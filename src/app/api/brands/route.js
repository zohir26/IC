// api/brands/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET() {
  try {
    await dbConnect();

    const brands = await Brand.find({}, {
      brandId: 1,
      name: 1,
      logo: 1,
      description: 1,
      website: 1,
      specialties: 1,
      products: 1
    }).sort({ brandId: 1 });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('POST - Creating new brand with data:', body);
    
    // Validate required fields
    const { name, logo } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, error: 'Name and logo are required fields' },
        { status: 400 }
      );
    }
    
    // Check if brand with this name already exists
    const existingBrand = await Brand.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'A brand with this name already exists' },
        { status: 400 }
      );
    }
    
    // Get the next brandId
    const lastBrand = await Brand.findOne({}, {}, { sort: { brandId: -1 } });
    const nextBrandId = lastBrand ? lastBrand.brandId + 1 : 1;
    
    // Create the brand
    const brandData = {
      brandId: nextBrandId,
      name: name.trim(),
      logo: logo.trim(),
      description: body.description?.trim() || '',
      website: body.website?.trim() || '',
      specialties: Array.isArray(body.specialties) ? body.specialties.filter(spec => spec && spec.trim()) : [],
      products: [] // Initialize with empty products array
    };
    
    console.log('Creating brand with data:', brandData);
    
    const newBrand = await Brand.create(brandData);
    
    console.log('Brand created successfully:', newBrand);
    
    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      brand: newBrand
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating brand:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A brand with this information already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create brand', details: error.message },
      { status: 500 }
    );
  }
}