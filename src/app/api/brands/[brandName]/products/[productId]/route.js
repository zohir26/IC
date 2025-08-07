import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { brandName, productId } = params;
    
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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { brandName, productId } = params;
    const body = await request.json();
    
    console.log('PUT - Updating product:', productId, 'for brand:', brandName, 'Data:', body);
    
    // Validate required fields
    const { productId: newProductId, name } = body;
    if (!newProductId || !name) {
      return NextResponse.json(
        { success: false, error: 'Product ID and name are required' },
        { status: 400 }
      );
    }
    
    const searchName = brandName.replace(/-/g, ' ');
    const brand = await Brand.findOne({
      name: { $regex: new RegExp(`^${searchName}$`, 'i') }
    });
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Find the product index
    const productIndex = brand.products.findIndex(p => p.productId === productId);
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Validate alternative products
    if (body.alternativeProducts && Array.isArray(body.alternativeProducts)) {
      for (const altProduct of body.alternativeProducts) {
        if (!altProduct.productId || !altProduct.name) {
          return NextResponse.json(
            { success: false, error: 'Each alternative product must have a productId and name' },
            { status: 400 }
          );
        }
      }
    }
    
    // Prepare updated product data
    const updatedProduct = {
      productId: newProductId.trim(),
      name: name.trim(),
      category: body.category?.trim() || '',
      description: body.description?.trim() || '',
      specifications: body.specifications || {},
      price: Number(body.price) || 0,
      stock: Number(body.stock) || 0,
      image: body.image?.trim() || '',
      datasheet: body.datasheet?.trim() || '',
      applications: Array.isArray(body.applications) ? body.applications.filter(app => app && app.trim()) : [],
      relatedProducts: Array.isArray(body.relatedProducts) ? body.relatedProducts.filter(rel => rel && rel.trim()) : [],
      alternativeProducts: Array.isArray(body.alternativeProducts) ? body.alternativeProducts.map(alt => ({
        productId: alt.productId.trim(),
        name: alt.name.trim(),
        brandName: alt.brandName?.trim() || '',
        category: alt.category?.trim() || '',
        price: Number(alt.price) || 0,
        stock: Number(alt.stock) || 0,
        image: alt.image?.trim() || ''
      })) : []
    };
    
    // Update the specific product
    brand.products[productIndex] = updatedProduct;
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      brand._id,
      { $set: { products: brand.products } },
      { new: true, runValidators: true }
    );
    
    if (!updatedBrand) {
      return NextResponse.json(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }
    
    console.log('Product updated successfully:', updatedProduct);
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { brandName, productId } = params;
    
    console.log('DELETE - Deleting product:', productId, 'from brand:', brandName);
    
    const searchName = brandName.replace(/-/g, ' ');
    const brand = await Brand.findOne({
      name: { $regex: new RegExp(`^${searchName}$`, 'i') }
    });
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Filter out the product to delete
    const updatedProducts = brand.products.filter(p => p.productId !== productId);
    
    if (updatedProducts.length === brand.products.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Update the brand with the new products array
    const updatedBrand = await Brand.findByIdAndUpdate(
      brand._id,
      { $set: { products: updatedProducts } },
      { new: true, runValidators: true }
    );
    
    if (!updatedBrand) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }
    
    console.log('Product deleted successfully:', productId);
    
    return NextResponse.json({
      success: true,
      message: `Product ${productId} deleted successfully`,
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product', details: error.message },
      { status: 500 }
    );
  }
}