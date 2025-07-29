// api/brands/[brandName]/route.js
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
    
    // Try to find by brandId if numeric, otherwise by name
    if (!isNaN(brandName)) {
      console.log('Searching by brandId:', parseInt(brandName));
      brand = await Brand.findOne({ brandId: parseInt(brandName) });
    } else {
      // Convert URL-friendly name back to searchable format
      const searchName = brandName.replace(/-/g, ' ');
      console.log('Searching by name (case-insensitive):', searchName);
      
      // Case-insensitive regex search
      const regex = new RegExp(`^${searchName}$`, 'i');
      console.log('Using regex:', regex);
      
      brand = await Brand.findOne({
        name: { $regex: regex }
      });
      
      // If still not found, try without anchors (partial match)
      if (!brand) {
        console.log('Trying partial match...');
        const partialRegex = new RegExp(searchName, 'i');
        brand = await Brand.findOne({
          name: { $regex: partialRegex }
        });
      }
      
      // If still not found, try with different case variations
      if (!brand) {
        console.log('Trying exact string match variations...');
        const variations = [
          searchName.toLowerCase(),
          searchName.toUpperCase(),
          searchName.charAt(0).toUpperCase() + searchName.slice(1).toLowerCase(),
          brandName.toLowerCase(),
          brandName.toUpperCase(),
          brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase()
        ];
        
        for (const variation of variations) {
          console.log('Trying variation:', variation);
          brand = await Brand.findOne({
            name: { $regex: new RegExp(`^${variation}$`, 'i') }
          });
          if (brand) {
            console.log('Found with variation:', variation);
            break;
          }
        }
      }
    }

    // Debug: Show all available brands if not found
    if (!brand) {
      console.log('❌ Brand not found. Available brands:');
      const allBrands = await Brand.find({}, { name: 1, brandId: 1 }).limit(10);
      allBrands.forEach(b => {
        console.log(`  - ID: ${b.brandId}, Name: "${b.name}"`);
      });
      
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found brand:', brand.name);
    console.log('📦 Products count:', brand.products?.length || 0);
    
    if (brand.products && brand.products.length > 0) {
      console.log('📋 First product:', brand.products[0].name);
      console.log('🔗 First product related:', brand.products[0].relatedProducts);
      console.log('🔄 First product alternatives:', brand.products[0].alternativeProducts?.length || 0);
    }

    const response = {
      ...brand.toObject(),
      products: brand.products || []
    };

    console.log('📤 Sending response with products:', response.products.length);
    console.log('=== END DEBUG ===');

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
    
    let existingBrand;
    
    if (!isNaN(brandName)) {
      existingBrand = await Brand.findOne({ brandId: parseInt(brandName) });
    } else {
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
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      existingBrand._id,
      body,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      brand: updatedBrand
    });
    
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { brandName } = await params;
    
    let brandToDelete;
    
    if (!isNaN(brandName)) {
      brandToDelete = await Brand.findOne({ brandId: parseInt(brandName) });
    } else {
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
    
    await Brand.findByIdAndDelete(brandToDelete._id);
    
    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}