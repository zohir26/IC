import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { brandName } = await params;
    
    console.log('=== BRAND API DEBUG ===');
    console.log('Requested brandName:', brandName);
    
    let brand = null;
    
    // Try multiple search strategies
    if (!isNaN(brandName)) {
      console.log('Searching by brandId:', parseInt(brandName));
      brand = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    if (!brand && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Searching by _id:', brandName);
      brand = await Brand.findById(brandName);
    }
    
    if (!brand) {
      const searchName = brandName.replace(/-/g, ' ');
      console.log('Searching by name (case-insensitive):', searchName);
      
      brand = await Brand.findOne({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      });
    }

    if (!brand) {
      console.log('❌ Brand not found. Available brands:');
      const allBrands = await Brand.find({}, { name: 1, brandId: 1 }).limit(10);
      allBrands.forEach(b => {
        console.log(`  - ID: ${b.brandId}, Name: "${b.name}", _id: ${b._id}`);
      });
      
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found brand:', brand.name);
    console.log('=== END DEBUG ===');

    const response = {
      ...brand.toObject(),
      products: brand.products || []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { brandName } = await params;
    const body = await request.json();
    
    console.log('PUT - Updating brand with identifier:', brandName, 'Data:', body);
    
    // Validate required fields
    const { name, logo, products } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, error: 'Name and logo are required fields' },
        { status: 400 }
      );
    }
    
    let existingBrand;
    
    // Try to find brand by multiple methods
    if (!isNaN(brandName)) {
      existingBrand = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    if (!existingBrand && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      existingBrand = await Brand.findById(brandName);
    }
    
    if (!existingBrand) {
      const searchName = brandName.replace(/-/g, ' ');
      existingBrand = await Brand.findOne({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      });
    }
    
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate brand name (excluding current brand)
    const duplicateBrand = await Brand.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: existingBrand._id }
    });
    
    if (duplicateBrand) {
      return NextResponse.json(
        { success: false, error: 'Another brand with this name already exists' },
        { status: 400 }
      );
    }
    
    // Validate products array
    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (!product.productId || !product.name) {
          return NextResponse.json(
            { success: false, error: 'Each product must have a productId and name' },
            { status: 400 }
          );
        }
        // Validate alternative products
        if (product.alternativeProducts && Array.isArray(product.alternativeProducts)) {
          for (const altProduct of product.alternativeProducts) {
            if (!altProduct.productId || !altProduct.name) {
              return NextResponse.json(
                { success: false, error: 'Each alternative product must have a productId and name' },
                { status: 400 }
              );
            }
          }
        }
      }
    }
    
    // Update the brand
    const updateData = {
      name: name.trim(),
      logo: logo.trim(),
      description: body.description?.trim() || '',
      website: body.website?.trim() || '',
      specialties: Array.isArray(body.specialties) ? body.specialties.filter(spec => spec && spec.trim()) : [],
      products: Array.isArray(products) ? products.map(product => ({
        productId: product.productId.trim(),
        name: product.name.trim(),
        category: product.category?.trim() || '',
        description: product.description?.trim() || '',
        specifications: product.specifications || {},
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        image: product.image?.trim() || '',
        datasheet: product.datasheet?.trim() || '',
        applications: Array.isArray(product.applications) ? product.applications.filter(app => app && app.trim()) : [],
        relatedProducts: Array.isArray(product.relatedProducts) ? product.relatedProducts.filter(rel => rel && rel.trim()) : [],
        alternativeProducts: Array.isArray(product.alternativeProducts) ? product.alternativeProducts.map(alt => ({
          productId: alt.productId.trim(),
          name: alt.name.trim(),
          brandName: alt.brandName?.trim() || '',
          category: alt.category?.trim() || '',
          price: Number(alt.price) || 0,
          stock: Number(alt.stock) || 0,
          image: alt.image?.trim() || ''
        })) : []
      })) : []
    };
    
    console.log('Updating brand with data:', updateData);
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      existingBrand._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedBrand) {
      return NextResponse.json(
        { success: false, error: 'Failed to update brand' },
        { status: 500 }
      );
    }
    
    console.log('Brand updated successfully:', updatedBrand);
    
    return NextResponse.json({
      success: true,
      message: 'Brand updated successfully',
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error('Error updating brand:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate key error' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update brand', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { brandName } = await params;
    console.log('DELETE - Deleting brand with identifier:', brandName);
    
    let brandToDelete;
    
    if (!isNaN(brandName)) {
      console.log('Searching by brandId:', parseInt(brandName));
      brandToDelete = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    if (!brandToDelete && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Searching by _id:', brandName);
      brandToDelete = await Brand.findById(brandName);
    }
    
    if (!brandToDelete) {
      const searchName = brandName.replace(/-/g, ' ');
      console.log('Searching by name:', searchName);
      brandToDelete = await Brand.findOne({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      });
    }
    
    if (!brandToDelete) {
      console.log('❌ Brand not found for deletion. Available brands:');
      const allBrands = await Brand.find({}, { name: 1, brandId: 1, _id: 1 }).limit(10);
      allBrands.forEach(b => {
        console.log(`  - brandId: ${b.brandId}, Name: "${b.name}", _id: ${b._id}`);
      });
      
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    console.log('Found brand to delete:', {
      _id: brandToDelete._id,
      brandId: brandToDelete.brandId,
      name: brandToDelete.name,
      productsCount: brandToDelete.products?.length || 0
    });
    
    // Allow deletion even if products exist, as products are managed separately
    const deletedBrand = await Brand.findByIdAndDelete(brandToDelete._id);
    
    if (!deletedBrand) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete brand' },
        { status: 500 }
      );
    }
    
    console.log('✅ Brand deleted successfully:', deletedBrand.name);
    
    return NextResponse.json({
      success: true,
      message: `Brand "${deletedBrand.name}" deleted successfully`
    });
    
  } catch (error) {
    console.error('❌ Error deleting brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand', details: error.message },
      { status: 500 }
    );
  }
}