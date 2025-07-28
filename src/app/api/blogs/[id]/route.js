import dbConnect from '../../../../lib/dbConnect';
import Blog from '../../../../models/Blog';
import { NextResponse } from 'next/server';

// GET single blog by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: blog,
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
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Remove any _id field from the body to prevent conflicts
    const { _id, ...updateData } = body;

    // Validate required fields
    const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
    const missingFields = requiredFields.filter(field => !updateData[field]);
    
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
    if (updateData.views) {
      updateData.views = parseInt(updateData.views, 10) || 0;
    } else {
      updateData.views = 0;
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

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validations
      }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: error.errors },
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
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
      blog: deletedBlog
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog', details: error.message },
      { status: 500 }
    );
  }
}
