// File: app/api/products/search/route.js
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || 10;
    
    let searchQuery = {};
    
    if (query) {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { brandName: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { type: { $regex: query, $options: 'i' } }
        ]
      };
    }
    
    const products = await Product.find(searchQuery)
      .select('_id name brandName category type specifications price image')
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    return Response.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}