// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017';
// let client;
// let clientPromise;

// if (!global._mongoClientPromise) {
//   client = new MongoClient(uri);
//   global._mongoClientPromise = client.connect();
// }
// clientPromise = global._mongoClientPromise;

// export async function GET(request, { params }) {
//   try {
//     // Await params before destructuring
//     const { id } = await params;
    
//     const mongoClient = await clientPromise;
//     const db = mongoClient.db('IC');
//     const collection = db.collection('products');

//     // Find product by _id
//     const product = await collection.findOne({ _id: id });

//     if (!product) {
//       return NextResponse.json(
//         { error: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ product });
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch product' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const product = await Product.findOne({ _id: id }).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product', details: error.message },
      { status: 500 }
    );
  }
}