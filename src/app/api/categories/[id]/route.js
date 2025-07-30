// api/categories/[id]/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

// Helper function to determine if ID is MongoDB ObjectId or custom numeric ID
function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Fetch single category
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('GET Category - ID received:', id);

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's a numeric ID, try to parse it
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid category ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('GET Category - Query:', query);

    const category = await Category.findOne(query).lean();
    console.log('GET Category - Found:', !!category);

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(`Error fetching category with id: ${params.id}`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category',
      details: error.message
    }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    console.log('PUT Category - ID received:', id);
    console.log('PUT Category - Body:', body);

    // Validate required fields
    const { name, icon, link } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 });
    }
    
    if (!icon || !icon.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category icon URL is required'
      }, { status: 400 });
    }
    
    if (!link || !link.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category link is required'
      }, { status: 400 });
    }

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's a numeric ID, try to parse it
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid category ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('PUT Category - Query:', query);

    // Find existing category
    const existingCategory = await Category.findOne(query);
    
    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Check for duplicate names (excluding current category)
    const duplicateCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: existingCategory._id }
    });
    
    if (duplicateCategory) {
      return NextResponse.json({
        success: false,
        error: 'Another category with this name already exists'
      }, { status: 400 });
    }

    // Prepare update data with proper validation
    const updateData = {
      name: name.trim(),
      icon: icon.trim(),
      link: link.trim(),
      
      // Process subcategories - ensure all required fields
      subcategories: (body.subcategories || [])
        .filter(sub => sub.name && sub.name.trim() && sub.description && sub.description.trim() && sub.link && sub.link.trim())
        .map((sub, index) => ({
          id: sub.id || (existingCategory.id * 100 + index + 1),
          name: sub.name.trim(),
          description: sub.description.trim(),
          link: sub.link.trim()
        })),
      
      // Process top manufacturers - ensure all required fields
      topManufacturers: (body.topManufacturers || [])
        .filter(mfg => mfg.name && mfg.name.trim() && mfg.logo && mfg.logo.trim() && mfg.website && mfg.website.trim())
        .map((mfg, index) => ({
          id: mfg.id || (existingCategory.id * 1000 + index + 1),
          name: mfg.name.trim(),
          logo: mfg.logo.trim(),
          specialties: Array.isArray(mfg.specialties) 
            ? mfg.specialties.filter(spec => spec && spec.trim()).map(spec => spec.trim())
            : [],
          website: mfg.website.trim()
        })),
      
      // Process popular parts - ensure all required fields
      popularParts: (body.popularParts || [])
        .filter(part => 
          part.partNumber && part.partNumber.trim() && 
          part.manufacturer && part.manufacturer.trim() && 
          part.category && part.category.trim() && 
          part.description && part.description.trim() && 
          part.image && part.image.trim() && 
          part.price && part.price.trim() && 
          part.link && part.link.trim()
        )
        .map((part, index) => ({
          id: part.id || (existingCategory.id * 10000 + index + 1),
          partNumber: part.partNumber.trim(),
          manufacturer: part.manufacturer.trim(),
          category: part.category.trim(),
          description: part.description.trim(),
          image: part.image.trim(),
          price: part.price.trim(),
          inStock: Boolean(part.inStock),
          popularity: part.popularity ? Math.min(100, Math.max(0, parseInt(part.popularity))) : 50,
          link: part.link.trim()
        })),
      
      // Process details - provide defaults for required fields
      details: {
        description: (body.details?.description || '').trim() || existingCategory.details?.description || 'Default category description',
        applications: (body.details?.applications || [])
          .filter(app => app && app.trim())
          .map(app => app.trim()),
        keyFeatures: (body.details?.keyFeatures || [])
          .filter(feature => feature && feature.trim())
          .map(feature => feature.trim()),
        marketInfo: (body.details?.marketInfo || '').trim() || existingCategory.details?.marketInfo || 'Market information not available'
      }
    };
    
    console.log('PUT Category - Update data:', updateData);

    const updatedCategory = await Category.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true, lean: true }
    );

    console.log('PUT Category - Updated:', !!updatedCategory);

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update category'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error(`Error updating category with id: ${params.id}`, error);
    
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
      error: 'Failed to update category',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('DELETE Category - ID received:', id);

    let query;
    if (isObjectId(id)) {
      // If it's a MongoDB ObjectId
      query = { _id: id };
    } else {
      // If it's a numeric ID, try to parse it
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid category ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('DELETE Category - Query:', query);

    const deletedCategory = await Category.findOneAndDelete(query);
    console.log('DELETE Category - Deleted:', !!deletedCategory);

    if (!deletedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: deletedCategory
    });
  } catch (error) {
    console.error(`Error deleting category with id: ${params.id}`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category',
      details: error.message
    }, { status: 500 });
  }
}