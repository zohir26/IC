// api/brands/[brandName]/route.js - FIXED VERSION
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
      // Search by brandId if numeric
      console.log('Searching by brandId:', parseInt(brandName));
      brand = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    // If not found and looks like MongoDB ObjectId, search by _id
    if (!brand && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Searching by _id:', brandName);
      brand = await Brand.findById(brandName);
    }
    
    // If still not found, search by name (case-insensitive)
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
    const { name, logo } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, error: 'Name and logo are required fields' },
        { status: 400 }
      );
    }
    
    let existingBrand;
    
    // Try to find brand by multiple methods
    if (!isNaN(brandName)) {
      // Search by brandId if numeric
      existingBrand = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    // If not found and looks like MongoDB ObjectId, search by _id
    if (!existingBrand && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      existingBrand = await Brand.findById(brandName);
    }
    
    // If still not found, search by name
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
    
    // Check if another brand with the same name exists (excluding current brand)
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
    
    // Update the brand
    const updateData = {
      name: name.trim(),
      logo: logo.trim(),
      description: body.description?.trim() || '',
      website: body.website?.trim() || '',
      specialties: Array.isArray(body.specialties) ? body.specialties.filter(spec => spec && spec.trim()) : []
    };
    
    console.log('Updating brand with data:', updateData);
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      existingBrand._id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Brand updated successfully:', updatedBrand);
    
    return NextResponse.json({
      success: true,
      message: 'Brand updated successfully',
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error('Error updating brand:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
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
    
    // Try to find brand by multiple methods
    if (!isNaN(brandName)) {
      // Search by brandId if numeric
      console.log('Searching by brandId:', parseInt(brandName));
      brandToDelete = await Brand.findOne({ brandId: parseInt(brandName) });
    }
    
    // If not found and looks like MongoDB ObjectId, search by _id
    if (!brandToDelete && brandName.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Searching by _id:', brandName);
      brandToDelete = await Brand.findById(brandName);
    }
    
    // If still not found, search by name
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
    
    // Check if brand has products
    if (brandToDelete.products && brandToDelete.products.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete brand "${brandToDelete.name}" as it has ${brandToDelete.products.length} existing products. Please remove all products first.` 
        },
        { status: 400 }
      );
    }
    
    // Delete the brand
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