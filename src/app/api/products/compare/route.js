// File: app/api/products/compare/route.js
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { productIds } = await request.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return Response.json(
        { message: 'Product IDs are required' }, 
        { status: 400 }
      );
    }
    
    // Fetch complete product data for comparison
    const products = await Product.find({ _id: { $in: productIds } });
    
    return Response.json({ products });
  } catch (error) {
    console.error('Compare error:', error);
    return Response.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}