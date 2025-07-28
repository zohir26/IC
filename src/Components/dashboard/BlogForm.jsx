import React from 'react';
import { X, Save } from 'lucide-react';

const BlogForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  editingItem, 
  onCancel 
}) => {
  // Debug logging
  console.log('BlogForm rendered with:', {
    formData,
    editingItem,
    loading,
    hasFormData: !!formData,
    hasEditingItem: !!editingItem,
    editingItemId: editingItem?._id || editingItem?.id || 'none'
  });

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
    const isValid = requiredFields.every((field) => {
      const value = formData[field];
      const valid = value && value.toString().trim().length > 0;
      if (!valid) console.log(`Validation failed for ${field}:`, value);
      return valid;
    });
    console.log('Form Valid:', isValid);
    return isValid;
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <button
            onClick={() => {
              console.log('Header Cancel clicked');
              onCancel();
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close form"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Scrollable Form Content */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <form 
          onSubmit={(e) => {
            console.log('Form submitted with data:', formData);
            onSubmit(e);
          }} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title * {!(formData.title?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Understanding Integrated Circuits"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author * {!(formData.author?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
              </label>
              <input
                id="author"
                type="text"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="e.g., Dr. Sarah Chen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category * {!(formData.category?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
              </label>
              <input
                id="category"
                type="text"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Basics, Advanced, Tutorials"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date * {!(formData.publishDate?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
              </label>
              <input
                id="publishDate"
                type="date"
                value={formData.publishDate || ''}
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                Read Time * {!(formData.readTime?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
              </label>
              <input
                id="readTime"
                type="text"
                placeholder="e.g., 8 minutes"
                value={formData.readTime || ''}
                onChange={(e) => handleInputChange('readTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-1">Views</label>
              <input
                id="views"
                type="number"
                min="0"
                value={formData.views || 0}
                onChange={(e) => handleInputChange('views', parseInt(e.target.value) || 0)}
                placeholder="e.g., 15420"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Post
              </label>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                value={formData.status || 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL * {!(formData.img?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
            </label>
            <input
              id="img"
              type="url"
              value={formData.img || ''}
              onChange={(e) => handleInputChange('img', e.target.value)}
              placeholder="https://i.ibb.co/4n2bBLMd/Understanding-Integrated-Circuits.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={formData.tagsString || (formData.tags && Array.isArray(formData.tags) ? formData.tags.join(', ') : '')}
              onChange={(e) => {
                const tagsArray = e.target.value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
                setFormData((prev) => ({
                  ...prev,
                  tagsString: e.target.value,
                  tags: tagsArray
                }));
              }}
              placeholder="e.g., semiconductors, electronics, beginner"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary * {!(formData.summary?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
            </label>
            <textarea
              id="summary"
              rows="3"
              value={formData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief summary of the blog post..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content * {!(formData.content?.trim()) && <span className="text-red-500 text-xs">(Required)</span>}
            </label>
            <textarea
              id="content"
              rows="8"
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Full blog post content... (Markdown supported)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              aria-required="true"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports Markdown formatting. Word count: {(formData.content || '').split(' ').filter((word) => word.length > 0).length}
            </p>
          </div>
          
          {/* Form validation indicator */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Form Valid: {isFormValid() ? '✅ Yes' : '❌ No'} | Loading: {loading ? 'Yes' : 'No'}
            </div>
          )}
        </form>
      </div>
      
      {/* Fixed Footer with Action Buttons */}
      <div className="sticky  bg-white border-t border-gray-200 p-6 rounded-b-lg z-10 mb-20">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('Submit button clicked with data:', formData);
              console.log('EditingItem:', editingItem);
              console.log('Is editing mode:', !!editingItem);
              
              // Create a synthetic form event for the onSubmit handler
              const syntheticEvent = {
                preventDefault: () => {},
                target: e.target.closest('form') || { elements: [] }
              };
              
              onSubmit(syntheticEvent);
            }}
            disabled={loading || !isFormValid()}
            className={`px-4 py-2 rounded-md flex items-center font-medium transition-colors ${
              loading || !isFormValid()
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={editingItem ? 'Update blog post' : 'Create blog post'}
          >
            <Save size={16} className="mr-2" />
            {loading ? 'Saving...' : (editingItem ? 'Update Blog' : 'Create Blog')}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Cancel button clicked');
              onCancel();
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 flex items-center"
            aria-label="Cancel form"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;