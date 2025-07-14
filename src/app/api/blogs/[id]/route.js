import dbConnect from '../../../../lib/dbConnect';
import Blog from '../../../../models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    // Find the blog, increment its views, and return the *new* document
    // This is more efficient than two separate operations.
    const blog = await Blog.findOneAndUpdate(
      { id: numericId },
      { $inc: { views: 1 } },
      { new: true, lean: true } // {new: true} returns the modified document
    );

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
    console.error(`Error fetching blog with id: ${params.id}`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const body = await request.json();
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const updatedBlog = await Blog.findOneAndUpdate(
      { id: numericId },
      { $set: body },
      { new: true, runValidators: true, lean: true } // runValidators ensures updates adhere to schema
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
    });
  } catch (error) {
    console.error(`Error updating blog with id: ${params.id}`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const deletedBlog = await Blog.findOneAndDelete({ id: numericId });
    
    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error(`Error deleting blog with id: ${params.id}`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog', details: error.message },
      { status: 500 }
    );
  }
}