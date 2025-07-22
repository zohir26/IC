import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  datasheet: {
    type: String
  },
  applications: [{
    type: String
  }],
  relatedProducts: [{
    type: String
  }]
}, {
  timestamps: true
});

const BrandSchema = new mongoose.Schema({
  brandId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  products: [ProductSchema]
}, {
  timestamps: true
});

// Create indexes for better performance
BrandSchema.index({ name: 1 });
BrandSchema.index({ 'products.productId': 1 });
BrandSchema.index({ 'products.category': 1 });

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);