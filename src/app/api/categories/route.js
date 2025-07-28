// import dbConnect from "@/lib/dbConnect";
// import Category from "@/models/Category";

// export default async function handler(req, res) {
//   const { method } = req;

//   await dbConnect();

//   switch (method) {
//     case 'GET':
//       try {
//         const { search, limit, page = 1 } = req.query;
//         let query = {};
        
//         // Add search functionality
//         if (search) {
//           query = {
//             $or: [
//               { name: { $regex: search, $options: 'i' } },
//               { 'subcategories.name': { $regex: search, $options: 'i' } },
//               { 'details.description': { $regex: search, $options: 'i' } }
//             ]
//           };
//         }

//         let categoriesQuery = Category.find(query).sort({ id: 1 });
        
//         // Add pagination if limit is provided
//         if (limit) {
//           const limitNum = parseInt(limit);
//           const skip = (parseInt(page) - 1) * limitNum;
//           categoriesQuery = categoriesQuery.skip(skip).limit(limitNum);
//         }

//         const categories = await categoriesQuery.lean();
        
//         // Get total count for pagination
//         const totalCount = await Category.countDocuments(query);
        
//         res.status(200).json({
//           success: true,
//           data: categories,
//           pagination: limit ? {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             total: totalCount,
//             pages: Math.ceil(totalCount / parseInt(limit))
//           } : null
//         });
//       } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//       }
//       break;

//     case 'POST':
//       try {
//         const category = await Category.create(req.body);
//         res.status(201).json({ success: true, data: category });
//       } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//       }
//       break;

//     default:
//       res.status(400).json({ success: false, message: 'Method not allowed' });
//       break;
//   }
// }
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET(request) {
  try {
    await dbConnect();
    
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'subcategories.name': { $regex: search, $options: 'i' } },
          { 'details.description': { $regex: search, $options: 'i' } }
        ]
      };
    }

    let categoriesQuery = Category.find(query).sort({ id: 1 });
    
    // Add pagination if limit is provided
    if (limit) {
      const limitNum = parseInt(limit);
      const skip = (parseInt(page) - 1) * limitNum;
      categoriesQuery = categoriesQuery.skip(skip).limit(limitNum);
    }

    const categories = await categoriesQuery.lean();
    
    // Get total count for pagination
    const totalCount = await Category.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: categories,
      categories: categories, // Also include in categories field for compatibility
      pagination: limit ? {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      } : null
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const category = await Category.create(body);
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}