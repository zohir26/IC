import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';


export async function GET() {
  try {
    await dbConnect();
    
    console.log('=== DEBUGGING MANUFACTURERS ===');
    
    const totalCount = await Product.countDocuments();
    console.log('Total products:', totalCount);
    
    const sampleProduct = await Product.findOne().lean();
    console.log('Sample product manufacturer info:', {
      manufacturer: sampleProduct?.manufacturer,
      manufacturerName: sampleProduct?.manufacturerName
    });
    
    // Get distinct values
    const distinctManufacturers = await Product.distinct('manufacturer');
    const distinctManufacturerNames = await Product.distinct('manufacturerName');
    
    console.log('Distinct manufacturers:', distinctManufacturers.slice(0, 10));
    console.log('Distinct manufacturerNames:', distinctManufacturerNames.slice(0, 10));
    
    // Try static method first, then fallback to manual aggregation
    let manufacturers = [];
    try {
      manufacturers = await Product.getManufacturersWithCounts();
      console.log('Static method manufacturers:', manufacturers.slice(0, 5));
    } catch (staticError) {
      console.log('Static method failed, trying manual aggregation');
      
      manufacturers = await Product.aggregate([
        {
          $match: {
            $and: [
              { isActive: { $ne: false } },
              {
                $or: [
                  { manufacturer: { $exists: true, $ne: null, $ne: "" } },
                  { manufacturerName: { $exists: true, $ne: null, $ne: "" } }
                ]
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              manufacturer: '$manufacturer',
              manufacturerName: '$manufacturerName'
            },
            displayName: { 
              $first: { 
                $cond: {
                  if: { $ne: ['$manufacturerName', null] },
                  then: '$manufacturerName',
                  else: '$manufacturer'
                }
              }
            },
            manufacturer: { $first: '$manufacturer' },
            manufacturerName: { $first: '$manufacturerName' },
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            displayName: { $ne: null, $ne: "" }
          }
        },
        {
          $sort: { displayName: 1 }
        }
      ]);
    }
    
    console.log('Final manufacturers result:', manufacturers.slice(0, 5));
    console.log('Total manufacturers found:', manufacturers.length);
    console.log('=== END DEBUG ===');
    
    return NextResponse.json({ 
      success: true,
      manufacturers,
      debug: {
        totalCount,
        distinctManufacturersCount: distinctManufacturers.length,
        distinctManufacturerNamesCount: distinctManufacturerNames.length,
        manufacturersFound: manufacturers.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch manufacturers', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}