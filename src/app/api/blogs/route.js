
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Establish database connection
    await dbConnect();
console.log('DB connected');
    // Fetch all blogs using the Mongoose model, sorted by publishDate descending
    const blogs = await Blog.find({}).sort({ publishDate: -1 }).lean();
    console.log('Blogs fetched successfully:', blogs.length);

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

// export async function POST(request) {
//   try {
//     // Establish database connection
//     await dbConnect();
    
//     const body = await request.json();

//     // Create a new blog instance using the Mongoose model
//     const newBlog = new Blog(body);
    
//     // Save the new blog to the database
//     const savedBlog = await newBlog.save();

//     return NextResponse.json({
//       success: true,
//       blog: savedBlog,
//     }, { status: 201 }); // 201 Created status
//   } catch (error) {
//     console.error('Error creating blog:', error);
//     // Handle potential validation errors from Mongoose
//     if (error.name === 'ValidationError') {
//       return NextResponse.json(
//         { success: false, error: 'Validation Error', details: error.errors },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, error: 'Failed to create blog', details: error.message },
//       { status: 500 }
//     );
//   }
// }