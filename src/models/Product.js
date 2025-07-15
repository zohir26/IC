// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  type: String,
  category: String,
  parentCategory: String,
  brand: String,
  brandName: String,
  manufacturer: String,
  manufacturerName: String,
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  applications: [String],
  features: [String],
  price: Number,
  availability: String,
  datasheet: String,
  image: String,
  videoUrl: String, // Add this field for comparison videos
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search functionality
ProductSchema.index({ 
  name: 'text', 
  brandName: 'text', 
  category: 'text',
  type: 'text'
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);