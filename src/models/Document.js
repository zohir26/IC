import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  brandName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
DocumentSchema.index({ productId: 1, uploadedAt: -1 });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);