import dbConnect from '../../../lib/dbConnect';
import Blog from '../../../models/Blog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Establish database connection
    await dbConnect();

    // Fetch all blogs using the Mongoose model, sorted by publishDate descending
    const blogs = await Blog.find({}).sort({ publishDate: -1 }).lean();

    return NextResponse.json({
      success: true,
      blogs: blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Establish database connection
    await dbConnect();
            
    const body = await request.json();
        
    // Remove any _id or id field from the body to let MongoDB generate it
    const { _id, id, ...blogData } = body;

    // Validate required fields
    const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
    const missingFields = requiredFields.filter(field => !blogData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure tags is an array
    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (!blogData.tags || !Array.isArray(blogData.tags)) {
      blogData.tags = [];
    }

    // Ensure views is a number
    if (blogData.views) {
      blogData.views = parseInt(blogData.views, 10) || 0;
    } else {
      blogData.views = 0;
    }

    // Ensure featured is a boolean
    blogData.featured = Boolean(blogData.featured);

    // Format publishDate properly
    if (blogData.publishDate) {
      const date = new Date(blogData.publishDate);
      if (!isNaN(date.getTime())) {
        blogData.publishDate = date.toISOString();
      }
    }

    // Create a new blog instance using the Mongoose model
    const newBlog = new Blog(blogData);
            
    // Save the new blog to the database
    const savedBlog = await newBlog.save();

    return NextResponse.json({
      success: true,
      blog: savedBlog,
      message: 'Blog created successfully'
    }, { status: 201 }); // 201 Created status
  } catch (error) {
    console.error('Error creating blog:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}
