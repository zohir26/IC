// api/brands/[brandName]/route.js - CORRECTED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Brand from '@/models/Brand';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Use params.brandName consistently (your file structure is [brandName])
    const brandName = params.brandName;
    console.log('GET brand with identifier:', brandName);
    
    // If brandName looks like an ID (MongoDB ObjectId pattern or number), search by ID first
    if (brandName.match(/^[0-9a-fA-F]{24}$/) || !isNaN(brandName)) {
      const brand = await Brand.findOne({
        $or: [
          { _id: brandName },
          { brandId: parseInt(brandName) || brandName }
        ]
      });
      
      if (brand) {
        return NextResponse.json({
          success: true,
          brand: brand
        });
      }
    }
    
    // Convert URL-friendly name back to actual brand name
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
    
    return NextResponse.json({
      success: true,
      brand: brand
    });
    
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brand', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Use params.brandName consistently
    const brandName = params.brandName;
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
    
    // If brandName looks like an ID, search by ID first
    if (brandName.match(/^[0-9a-fA-F]{24}$/) || !isNaN(brandName)) {
      existingBrand = await Brand.findOne({
        $or: [
          { _id: brandName },
          { brandId: parseInt(brandName) || brandName }
        ]
      });
    }
    
    // If not found by ID or brandName is not ID-like, search by name
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
    
    // FIXED: Use params.brandName consistently
    const brandName = params.brandName;
    console.log('DELETE - Deleting brand with identifier:', brandName);
    
    let brandToDelete;
    
    // If brandName looks like an ID, search by ID first
    if (brandName.match(/^[0-9a-fA-F]{24}$/) || !isNaN(brandName)) {
      brandToDelete = await Brand.findOne({
        $or: [
          { _id: brandName },
          { brandId: parseInt(brandName) || brandName }
        ]
      });
    }
    
    // If not found by ID or brandName is not ID-like, search by name
    if (!brandToDelete) {
      const searchName = brandName.replace(/-/g, ' ');
      brandToDelete = await Brand.findOne({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      });
    }
    
    if (!brandToDelete) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Check if brand has products
    if (brandToDelete.products && brandToDelete.products.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete brand with existing products' 
        },
        { status: 400 }
      );
    }
    
    // Delete the brand
    await Brand.findByIdAndDelete(brandToDelete._id);
    console.log('Brand deleted successfully:', brandToDelete.name);
    
    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand', details: error.message },
      { status: 500 }
    );
  }
}