// models/Brand.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  type: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  availability: String,
  description: String,
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  applications: [String],
  img: String,
  image: String,
  datasheet: String,

  // Array of product IDs
  relatedProducts: [String],

  // Embedded alternative products
  alternativeProducts: [{
    productId: String,
    name: String,
    brandName: String,
    category: String,
    price: Number,
    stock: Number,
    image: String
  }]
}, { _id: false }); // Prevents _id generation for subdocs

const brandSchema = new mongoose.Schema({
  brandId: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  products: [productSchema]
}, {
  timestamps: true
});

// Indexes
brandSchema.index({ brandId: 1 });
brandSchema.index({ name: 1 });
brandSchema.index({ 'products.productId': 1 });

const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
export default Brand;
