import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishDate: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better performance
blogSchema.index({ publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);