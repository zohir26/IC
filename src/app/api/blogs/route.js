import dbConnect from '../../../lib/dbConnect';
import Blog from '../../../models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Establish database connection
    await dbConnect();

    // Parse URL parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const sort = searchParams.get('sort') || 'publishDate';
    const order = searchParams.get('order') || 'desc';

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    console.log('Blog query:', query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    // Execute queries
    const [blogs, totalCount] = await Promise.all([
      Blog.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .lean(),
      Blog.countDocuments(query)
    ]);

    console.log(`Found ${blogs.length} blogs out of ${totalCount} total`);

    return NextResponse.json({
      success: true,
      blogs: blogs,
      data: blogs, // Also include for compatibility
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
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
    console.log('POST Blog - Creating new blog with data:', body);
            
    // Remove any _id or id field from the body to let MongoDB generate it
    const { _id, id, ...blogData } = body;

    // Validate required fields
    const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
    const missingFields = requiredFields.filter(field => !blogData[field] || blogData[field].toString().trim() === '');
        
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for duplicate title
    const existingBlog = await Blog.findOne({
      title: { $regex: new RegExp(`^${blogData.title.trim()}$`, 'i') }
    });

    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'A blog with this title already exists' },
        { status: 400 }
      );
    }

    // Clean and validate data
    blogData.title = blogData.title.trim();
    blogData.author = blogData.author.trim();
    blogData.category = blogData.category.trim();
    blogData.summary = blogData.summary.trim();
    blogData.content = blogData.content.trim();
    blogData.img = blogData.img.trim();
    blogData.readTime = blogData.readTime.trim();

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
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid publish date format' },
          { status: 400 }
        );
      }
    }

    console.log('Creating blog with processed data:', blogData);

    // Create a new blog instance using the Mongoose model
    const newBlog = new Blog(blogData);
                
    // Save the new blog to the database
    const savedBlog = await newBlog.save();

    console.log('Blog created successfully:', savedBlog);

    return NextResponse.json({
      success: true,
      blog: savedBlog,
      data: savedBlog,
      message: 'Blog created successfully'
    }, { status: 201 }); // 201 Created status
  } catch (error) {
    console.error('Error creating blog:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A blog with this information already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}