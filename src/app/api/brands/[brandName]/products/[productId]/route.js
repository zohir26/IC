import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';


export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { brandName, productId } = params;
    
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

    const product = brand.products.find(p => p.productId === productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products
    const relatedProducts = [];
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      relatedProducts.push(...brand.products.filter(p => 
        product.relatedProducts.includes(p.productId) && p.productId !== productId
      ));
    }

    return NextResponse.json({
      product,
      relatedProducts,
      brandInfo: {
        name: brand.name,
        logo: brand.logo,
        description: brand.description
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
