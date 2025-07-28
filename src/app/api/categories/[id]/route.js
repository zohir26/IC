// import dbConnect from "@/lib/dbConnect";
// import Category from "@/models/Category";


// export default async function handler(req, res) {
//   const {
//     query: { id },
//     method,
//   } = req;

//   await dbConnect();

//   switch (method) {
//     case 'GET':
//       try {
//         const category = await Category.findOne({ id: parseInt(id) }).lean();
        
//         if (!category) {
//           return res.status(404).json({ success: false, message: 'Category not found' });
//         }

//         res.status(200).json({ success: true, data: category });
//       } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//       }
//       break;

//     case 'PUT':
//       try {
//         const category = await Category.findOneAndUpdate(
//           { id: parseInt(id) }, 
//           req.body, 
//           {
//             new: true,
//             runValidators: true,
//           }
//         );

//         if (!category) {
//           return res.status(404).json({ success: false, message: 'Category not found' });
//         }

//         res.status(200).json({ success: true, data: category });
//       } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//       }
//       break;

//     case 'DELETE':
//       try {
//         const deletedCategory = await Category.deleteOne({ id: parseInt(id) });

//         if (!deletedCategory.deletedCount) {
//           return res.status(404).json({ success: false, message: 'Category not found' });
//         }

//         res.status(200).json({ success: true, data: {} });
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

// GET - Fetch single category
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID format'
      }, { status: 400 });
    }

    const category = await Category.findOne({ id: numericId }).lean();

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
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID'
      }, { status: 400 });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { id: numericId },
      { $set: body },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory
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
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID'
      }, { status: 400 });
    }

    const deletedCategory = await Category.findOneAndDelete({ id: numericId });

    if (!deletedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
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