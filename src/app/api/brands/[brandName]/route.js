import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const brandName = params.brandName;
    
    // Convert URL-friendly name back to actual brand name
    const searchName = brandName.replace(/-/g, ' ');
    
    const brand = await Brand.findOne({
      name: { $regex: new RegExp(`^${searchName}$`, 'i') }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}