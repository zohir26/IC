// models/Brand.js - Fixed version without duplicate indexes
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  brandId: {
    type: Number,
    unique: true,
    required: true
    // Removed index: true since we're using schema.index() below
  },
  name: {
    type: String,
    required: true,
    trim: true
    // Removed index: true since we're using schema.index() below
  },
  logo: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  website: {
    type: String,
    default: '',
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  products: [{
    productId: Number,
    name: String,
    type: String,
    category: String,
    price: Number,
    availability: String,
    description: String,
    specifications: Object,
    img: String
  }]
}, {
  timestamps: true
});

// Create indexes explicitly (this is the preferred way)
BrandSchema.index({ brandId: 1 });
BrandSchema.index({ name: 1 });

const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

export default Brand;