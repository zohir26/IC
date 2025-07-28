import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET() {
  try {
    await dbConnect();
    
    const brands = await Brand.find({}).sort({ brandId: 1 });
    
    return NextResponse.json({
      success: true,
      brands: brands
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('Creating brand with data:', body);
    
    // Validate required fields
    const { name, logo, description, website, specialties } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, error: 'Name and logo are required fields' },
        { status: 400 }
      );
    }
    
    // Check if brand with same name already exists
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand with this name already exists' },
        { status: 400 }
      );
    }
    
    // Generate brandId (you can modify this logic as needed)
    const lastBrand = await Brand.findOne({}).sort({ brandId: -1 });
    const newBrandId = lastBrand ? lastBrand.brandId + 1 : 1;
    
    // Create new brand
    const newBrand = new Brand({
      brandId: newBrandId,
      name: name.trim(),
      logo: logo.trim(),
      description: description?.trim() || '',
      website: website?.trim() || '',
      specialties: Array.isArray(specialties) ? specialties : [],
      products: [] // Initialize empty products array
    });
    
    const savedBrand = await newBrand.save();
    console.log('Brand created successfully:', savedBrand);
    
    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      brand: savedBrand
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
