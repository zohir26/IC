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
    const { id } = params;
    
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
    const { id } = params;
    const body = await request.json();
    
    console.log('PUT Category - ID received:', id);
    console.log('PUT Category - Body:', body);

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

    const updatedCategory = await Category.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true, lean: true }
    );

    console.log('PUT Category - Updated:', !!updatedCategory);

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error(`Error updating category with id: ${params.id}`, error);
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
    const { id } = params;
    
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