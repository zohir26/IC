import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Product identification
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // Product categorization
  type: {
    type: String,
    trim: true,
    index: true
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  parentCategory: {
    type: String,
    trim: true,
    index: true
  },
  
  // Brand information
  brand: {
    type: String,
    trim: true,
    index: true
  },
  brandName: {
    type: String,
    trim: true,
    index: true
  },
  
  // Manufacturer information
  manufacturer: {
    type: String,
    trim: true,
    index: true
  },
  manufacturerName: {
    type: String,
    trim: true,
    index: true
  },
  
  // Product details
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0,
    index: true
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  
  // Product attributes
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Media
  image: String,
  images: [String],
  
  // Inventory
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents with null/undefined SKU
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // SEO and URLs
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Ratings and reviews
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Additional fields that might exist in your database
  // Add any other fields you might have
  model: String,
  color: String,
  size: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  
  // Flexible field for any additional data
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  }
  
}, {
  timestamps: true,
  collection: 'products', // Explicitly set collection name
  strict: false // Allow additional fields not defined in schema
});

// Create compound indexes for better query performance
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ parentCategory: 1, category: 1 });
productSchema.index({ brand: 1, manufacturer: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ isActive: 1, isAvailable: 1 });

// Create text index for search functionality
productSchema.index({
  name: 'text',
  brandName: 'text',
  category: 'text',
  description: 'text',
  features: 'text'
}, {
  weights: {
    name: 10,
    brandName: 8,
    category: 6,
    description: 4,
    features: 2
  }
});

// Virtual for full brand name (fallback to brand if brandName doesn't exist)
productSchema.virtual('fullBrandName').get(function() {
  return this.brandName || this.brand;
});

// Virtual for full manufacturer name
productSchema.virtual('fullManufacturerName').get(function() {
  return this.manufacturerName || this.manufacturer;
});

// Static method to get all distinct values for a field
productSchema.statics.getDistinctValues = async function(field) {
  return await this.distinct(field, { 
    [field]: { $exists: true, $ne: null, $ne: "" },
    isActive: { $ne: false }
  });
};

// Static method to get brands with counts
productSchema.statics.getBrandsWithCounts = async function() {
  return await this.aggregate([
    { 
      $match: { 
        $or: [
          { brand: { $exists: true, $ne: null, $ne: "" } },
          { brandName: { $exists: true, $ne: null, $ne: "" } }
        ],
        isActive: { $ne: false }
      }
    },
    {
      $group: {
        _id: '$brand',
        brandName: { $first: '$brandName' },
        fullBrandName: { $first: { $ifNull: ['$brandName', '$brand'] } },
        count: { $sum: 1 }
      }
    },
    { $sort: { fullBrandName: 1 } }
  ]);
};

// Static method to get categories with counts
productSchema.statics.getCategoriesWithCounts = async function() {
  return await this.aggregate([
    { 
      $match: { 
        category: { $exists: true, $ne: null, $ne: "" },
        isActive: { $ne: false }
      }
    },
    {
      $group: {
        _id: {
          parentCategory: '$parentCategory',
          category: '$category',
          type: '$type'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.parentCategory': 1, '_id.category': 1, '_id.type': 1 } }
  ]);
};

// Static method to get manufacturers with counts
productSchema.statics.getManufacturersWithCounts = async function() {
  return await this.aggregate([
    { 
      $match: { 
        $or: [
          { manufacturer: { $exists: true, $ne: null, $ne: "" } },
          { manufacturerName: { $exists: true, $ne: null, $ne: "" } }
        ],
        isActive: { $ne: false }
      }
    },
    {
      $group: {
        _id: '$manufacturer',
        manufacturerName: { $first: '$manufacturerName' },
        fullManufacturerName: { $first: { $ifNull: ['$manufacturerName', '$manufacturer'] } },
        count: { $sum: 1 }
      }
    },
    { $sort: { fullManufacturerName: 1 } }
  ]);
};

// Prevent model recompilation during development
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
