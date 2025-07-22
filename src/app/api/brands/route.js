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
      website: 1
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
