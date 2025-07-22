import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { productId, docId } = params;
    
    const document = await Document.findOne({ 
      id: docId, 
      productId 
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filePath = path.join(
      process.cwd(), 
      'public', 
      'uploads', 
      'documents', 
      document.filename
    );
    
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await Document.deleteOne({ id: docId, productId });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}