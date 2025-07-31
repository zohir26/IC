
import dbConnect from '@/lib/dbConnect';
import Blog from '../../../../models/Blog';
import { NextResponse } from 'next/server';

// Helper function to determine if ID is MongoDB ObjectId or custom numeric ID
function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET single blog by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params; // Await params
    
    console.log('GET Blog - ID received:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
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
          error: 'Invalid blog ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('GET Blog - Query:', query);

    const blog = await Blog.findOne(query).lean();
    console.log('GET Blog - Found:', !!blog);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views when blog is fetched
    try {
      await Blog.findOneAndUpdate(query, { $inc: { views: 1 } });
    } catch (viewError) {
      console.warn('Failed to increment views:', viewError);
    }

    return NextResponse.json({
      success: true,
      blog: blog,
      data: blog // Also include for compatibility
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE blog by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params; // Await params
    
    console.log('PUT Blog - ID received:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('PUT Blog - Body:', body);
    
    // Remove any _id field from the body to prevent conflicts
    const { _id, ...updateData } = body;

    // Validate required fields
    const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
    const missingFields = requiredFields.filter(field => !updateData[field] || updateData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure tags is an array
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (!updateData.tags || !Array.isArray(updateData.tags)) {
      updateData.tags = [];
    }

    // Ensure views is a number
    if (updateData.views !== undefined) {
      updateData.views = parseInt(updateData.views, 10) || 0;
    }

    // Ensure featured is a boolean
    updateData.featured = Boolean(updateData.featured);

    // Format publishDate properly
    if (updateData.publishDate) {
      const date = new Date(updateData.publishDate);
      if (!isNaN(date.getTime())) {
        updateData.publishDate = date.toISOString();
      }
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
          error: 'Invalid blog ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('PUT Blog - Query:', query);
    console.log('PUT Blog - Update data:', updateData);

    const updatedBlog = await Blog.findOneAndUpdate(
      query,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validations
      }
    );

    console.log('PUT Blog - Updated:', !!updatedBlog);

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
      data: updatedBlog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update blog', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE blog by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params; // Await params
    
    console.log('DELETE Blog - ID received:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
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
          error: 'Invalid blog ID format'
        }, { status: 400 });
      }
      query = { id: numericId };
    }

    console.log('DELETE Blog - Query:', query);

    const deletedBlog = await Blog.findOneAndDelete(query);
    console.log('DELETE Blog - Deleted:', !!deletedBlog);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
      blog: deletedBlog,
      data: deletedBlog
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog', details: error.message },
      { status: 500 }
    );
  }
}