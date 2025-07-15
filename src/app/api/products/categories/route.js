import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('=== DEBUGGING CATEGORIES ===');
    
    const totalCount = await Product.countDocuments();
    console.log('Total products:', totalCount);
    
    const sampleProduct = await Product.findOne().lean();
    console.log('Sample product category info:', {
      category: sampleProduct?.category,
      parentCategory: sampleProduct?.parentCategory,
      type: sampleProduct?.type
    });
    
    // Get distinct values
    const distinctCategories = await Product.distinct('category');
    const distinctParentCategories = await Product.distinct('parentCategory');
    const distinctTypes = await Product.distinct('type');
    
    console.log('Distinct categories:', distinctCategories.slice(0, 10));
    console.log('Distinct parentCategories:', distinctParentCategories.slice(0, 10));
    console.log('Distinct types:', distinctTypes.slice(0, 10));
    
    // Try static method first, then fallback to manual aggregation
    let categories = [];
    try {
      categories = await Product.getCategoriesWithCounts();
      console.log('Static method categories:', categories.slice(0, 5));
    } catch (staticError) {
      console.log('Static method failed, trying manual aggregation');
      
      categories = await Product.aggregate([
        { 
          $match: { 
            category: { $exists: true, $ne: null, $ne: "" },
            isActive: { $ne: false }
          } 
        },
        {
          $group: {
            _id: {
              parentCategory: '$parentCategory',
              category: '$category',
              type: '$type'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.parentCategory': 1, '_id.category': 1, '_id.type': 1 } }
      ]);
    }
    
    console.log('Final categories result:', categories.slice(0, 5));
    console.log('Total categories found:', categories.length);
    console.log('=== END DEBUG ===');
    
    return NextResponse.json({ 
      success: true,
      categories,
      debug: {
        totalCount,
        distinctCategoriesCount: distinctCategories.length,
        distinctParentCategoriesCount: distinctParentCategories.length,
        distinctTypesCount: distinctTypes.length,
        categoriesFound: categories.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch categories', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}