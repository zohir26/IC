import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  img: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  publishDate: {
    type: Date, // Changed from String to Date for better handling
    required: [true, 'Publish date is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  readTime: {
    type: String,
    required: [true, 'Read time is required']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'blogs'
});

// Create indexes for better performance
blogSchema.index({ publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', summary: 'text', content: 'text' }); // Text search index

// Virtual for formatted publish date
blogSchema.virtual('formattedPublishDate').get(function() {
  return new Date(this.publishDate).toLocaleDateString();
});

// Method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);