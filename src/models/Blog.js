import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  img: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
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
    type: Date,
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

// Auto-assign ID before saving
blogSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    try {
      const lastBlog = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
      this.id = lastBlog ? lastBlog.id + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Create indexes for better performance
blogSchema.index({ id: 1 }, { unique: true });
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

// Transform function to ensure id field is included in JSON output
blogSchema.set('toJSON', {
  transform: function(doc, ret) {
    // Ensure id field is present
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  }
});

blogSchema.set('toObject', {
  transform: function(doc, ret) {
    // Ensure id field is present
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  }
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);