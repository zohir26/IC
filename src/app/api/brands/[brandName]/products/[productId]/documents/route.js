import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { productId } = params;
    
    const documents = await Document.find({ productId })
      .sort({ uploadedAt: -1 });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { productId } = params;
    const formData = await request.formData();
    
    const files = formData.getAll('documents');
    const brandName = formData.get('brandName');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const uploadedDocs = [];

    for (const file of files) {
      if (file.size === 0) continue;

      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Create document record
      const document = new Document({
        id: uuidv4(),
        productId,
        brandName,
        name: file.name,
        filename: uniqueFilename,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        mimetype: file.type,
        url: `/uploads/documents/${uniqueFilename}`,
        uploadedAt: new Date()
      });

      await document.save();
      uploadedDocs.push(document);
    }

    return NextResponse.json(uploadedDocs, { status: 201 });
  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Failed to upload documents' },
      { status: 500 }
    );
  }
}
