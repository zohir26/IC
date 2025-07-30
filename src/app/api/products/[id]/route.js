// api/products/[id]/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// Helper function to determine if ID is MongoDB ObjectId
function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('GET Product - ID received:', id);

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's not an ObjectId, try to find by name or other identifiers
      query = {
        $or: [
          { name: { $regex: new RegExp(`^${id}$`, 'i') } },
          { productCode: id }
        ]
      };
    }

    console.log('GET Product - Query:', query);

    const product = await Product.findOne(query).lean();
    console.log('GET Product - Found:', !!product);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
      product: product // Also include for compatibility
    });
  } catch (error) {
    console.error(`Error fetching product with id: ${params.id}`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product',
      details: error.message
    }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    console.log('PUT Product - ID received:', id);
    console.log('PUT Product - Body:', body);

    // Validate required fields
    const { name, type, category, price } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product name is required'
      }, { status: 400 });
    }
    
    if (!type || !type.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product type is required'
      }, { status: 400 });
    }
    
    if (!category || !category.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Product category is required'
      }, { status: 400 });
    }
    
    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json({
        success: false,
        error: 'Valid price is required'
      }, { status: 400 });
    }

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's not an ObjectId, try to find by name or other identifiers
      query = {
        $or: [
          { name: { $regex: new RegExp(`^${id}$`, 'i') } },
          { productCode: id }
        ]
      };
    }

    console.log('PUT Product - Query:', query);

    // Find existing product
    const existingProduct = await Product.findOne(query);
    
    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Check for duplicate names (excluding current product)
    const duplicateProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: existingProduct._id }
    });
    
    if (duplicateProduct) {
      return NextResponse.json({
        success: false,
        error: 'Another product with this name already exists'
      }, { status: 400 });
    }

    // Prepare update data with proper validation and cleaning
    const updateData = {
      name: name.trim(),
      type: type.trim(),
      category: category.trim(),
      price: parseFloat(price),
      
      // Optional fields with defaults
      parentCategory: body.parentCategory?.trim() || '',
      brand: body.brand?.trim() || '',
      brandName: body.brandName?.trim() || '',
      manufacturer: body.manufacturer?.trim() || '',
      manufacturerName: body.manufacturerName?.trim() || '',
      availability: body.availability || 'In Stock',
      description: body.description?.trim() || '',
      image: body.image?.trim() || '',
      datasheet: body.datasheet?.trim() || '',
      videoUrl: body.videoUrl?.trim() || '',
      
      // Clean specifications - filter out empty keys/values
      specifications: Object.fromEntries(
        Object.entries(body.specifications || {})
          .filter(([key, value]) => key.trim() && value.trim())
          .map(([key, value]) => [key.trim(), value.trim()])
      ),
      
      // Clean applications - filter out empty strings
      applications: (body.applications || [])
        .filter(app => app && app.trim())
        .map(app => app.trim()),
      
      // Clean features - filter out empty strings
      features: (body.features || [])
        .filter(feature => feature && feature.trim())
        .map(feature => feature.trim()),
      
      updatedAt: new Date()
    };
    
    console.log('PUT Product - Update data:', updateData);

    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true, lean: true }
    );

    console.log('PUT Product - Updated:', !!updatedProduct);

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update product'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error(`Error updating product with id: ${params.id}`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('DELETE Product - ID received:', id);

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's not an ObjectId, try to find by name or other identifiers
      query = {
        $or: [
          { name: { $regex: new RegExp(`^${id}$`, 'i') } },
          { productCode: id }
        ]
      };
    }

    console.log('DELETE Product - Query:', query);

    const deletedProduct = await Product.findOneAndDelete(query);
    console.log('DELETE Product - Deleted:', !!deletedProduct);

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    console.error(`Error deleting product with id: ${params.id}`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product',
      details: error.message
    }, { status: 500 });
  }
}