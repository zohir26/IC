import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true }
});

const ManufacturerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  specialties: [{ type: String }],
  website: { type: String, required: true }
});

const PopularPartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  partNumber: { type: String, required: true },
  manufacturer: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  popularity: { type: Number, min: 0, max: 100 },
  link: { type: String, required: true }
});

const CategoryDetailsSchema = new mongoose.Schema({
  description: { type: String, required: true },
  applications: [{ type: String }],
  keyFeatures: [{ type: String }],
  marketInfo: { type: String, required: true }
});

const CategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  link: { type: String, required: true },
  subcategories: [SubcategorySchema],
  topManufacturers: [ManufacturerSchema],
  popularParts: [PopularPartSchema],
  details: CategoryDetailsSchema
}, {
  timestamps: true
});

// Create indexes for better query performance
CategorySchema.index({ name: 'text', 'subcategories.name': 'text' });
CategorySchema.index({ id: 1 });
CategorySchema.index({ 'popularParts.popularity': -1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);