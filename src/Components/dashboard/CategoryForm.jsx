import React from 'react';
import { X, Save, PlusCircle, MinusCircle } from 'lucide-react';

const CategoryForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  editingItem,
  onCancel,
}) => {
  // Initialize formData with proper structure if it doesn't exist
  React.useEffect(() => {
    if (!formData.subcategories) {
      setFormData(prev => ({
        ...prev,
        subcategories: []
      }));
    }
    if (!formData.topManufacturers) {
      setFormData(prev => ({
        ...prev,
        topManufacturers: []
      }));
    }
    if (!formData.popularParts) {
      setFormData(prev => ({
        ...prev,
        popularParts: []
      }));
    }
    if (!formData.details) {
      setFormData(prev => ({
        ...prev,
        details: {
          description: '',
          applications: [],
          keyFeatures: [],
          marketInfo: ''
        }
      }));
    } else {
      // Ensure nested arrays exist
      if (!formData.details.applications) {
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            applications: []
          }
        }));
      }
      if (!formData.details.keyFeatures) {
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            keyFeatures: []
          }
        }));
      }
    }
  }, []);

  // Enhanced form submission handler with proper data cleaning
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (!formData.icon || !formData.icon.trim()) {
      alert('Category icon URL is required');
      return;
    }

    if (!formData.link || !formData.link.trim()) {
      alert('Category link is required');
      return;
    }

    // Prepare cleaned data for submission
    const cleanedData = {
      // Only include ID for editing existing categories
      ...(editingItem && formData.id ? { id: formData.id } : {}),
      
      // Required fields
      name: formData.name.trim(),
      icon: formData.icon.trim(),
      link: formData.link.trim(),
      
      // Clean subcategories - filter out incomplete ones
      subcategories: (formData.subcategories || [])
        .filter(sub => sub.name && sub.name.trim() && sub.description && sub.description.trim() && sub.link && sub.link.trim())
        .map((sub, index) => ({
          id: sub.id || (editingItem?.id ? (editingItem.id * 100 + index + 1) : (index + 1)),
          name: sub.name.trim(),
          description: sub.description.trim(),
          link: sub.link.trim()
        })),
      
      // Clean top manufacturers - filter out incomplete ones
      topManufacturers: (formData.topManufacturers || [])
        .filter(mfg => mfg.name && mfg.name.trim() && mfg.logo && mfg.logo.trim() && mfg.website && mfg.website.trim())
        .map((mfg, index) => ({
          id: mfg.id || (editingItem?.id ? (editingItem.id * 1000 + index + 1) : (index + 1)),
          name: mfg.name.trim(),
          logo: mfg.logo.trim(),
          specialties: Array.isArray(mfg.specialties) 
            ? mfg.specialties.filter(spec => spec && spec.trim()).map(spec => spec.trim())
            : [],
          website: mfg.website.trim()
        })),
      
      // Clean popular parts - filter out incomplete ones
      popularParts: (formData.popularParts || [])
        .filter(part => 
          part.partNumber && part.partNumber.trim() && 
          part.manufacturer && part.manufacturer.trim() && 
          part.category && part.category.trim() && 
          part.description && part.description.trim() && 
          part.image && part.image.trim() && 
          part.price && part.price.trim() && 
          part.link && part.link.trim()
        )
        .map((part, index) => ({
          id: part.id || (editingItem?.id ? (editingItem.id * 10000 + index + 1) : (index + 1)),
          partNumber: part.partNumber.trim(),
          manufacturer: part.manufacturer.trim(),
          category: part.category.trim(),
          description: part.description.trim(),
          image: part.image.trim(),
          price: part.price.trim(),
          inStock: Boolean(part.inStock),
          popularity: part.popularity ? parseInt(part.popularity) : 50,
          link: part.link.trim()
        })),
      
      // Clean details - ensure required fields are present
      details: {
        description: (formData.details?.description || '').trim() || 'Default category description',
        applications: (formData.details?.applications || [])
          .filter(app => app && app.trim())
          .map(app => app.trim()),
        keyFeatures: (formData.details?.keyFeatures || [])
          .filter(feature => feature && feature.trim())
          .map(feature => feature.trim()),
        marketInfo: (formData.details?.marketInfo || '').trim() || 'Market information not available'
      }
    };

    console.log('Submitting category data:', cleanedData);
    
    // Call the parent onSubmit with cleaned data
    await onSubmit(e, cleanedData);
  };

  // Helper function to update nested arrays
  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  // Helper function to add new item to an array
  const handleAddItem = (field, newItemStructure) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), newItemStructure],
    });
  };

  // Helper function to remove item from an array
  const handleRemoveItem = (field, index) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  // Helper to handle changes in the top level 'details' object
  const handleDetailsChange = (key, value) => {
    setFormData({
      ...formData,
      details: {
        ...(formData.details || {}),
        [key]: value,
      },
    });
  };

  // Helper to handle changes in array fields within 'details'
  const handleDetailsArrayChange = (field, index, value) => {
    const currentDetails = formData.details || {};
    const updatedArray = [...(currentDetails[field] || [])];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      details: {
        ...currentDetails,
        [field]: updatedArray,
      },
    });
  };

  const handleAddDetailsArrayItem = (field) => {
    const currentDetails = formData.details || {};
    setFormData({
      ...formData,
      details: {
        ...currentDetails,
        [field]: [...(currentDetails[field] || []), ''],
      },
    });
  };

  const handleRemoveDetailsArrayItem = (field, index) => {
    const currentDetails = formData.details || {};
    const updatedArray = [...(currentDetails[field] || [])];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      details: {
        ...currentDetails,
        [field]: updatedArray,
      },
    });
  };

  return (
    <div className="mb-20 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingItem ? 'Edit Category' : 'Add New Category'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Basic Category Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category ID {editingItem ? '(Cannot be changed)' : '(Auto-assigned)'}
            </label>
            <input
              type="number"
              value={formData.id || ''}
              onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || '' })}
              placeholder="Auto-assigned"
              disabled={true} // Always disabled since ID is auto-assigned
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {editingItem ? 'ID cannot be changed for existing categories' : 'ID will be automatically assigned'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Integrated Circuits (ICs)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL *</label>
            <input
              type="url"
              required
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="https://i.ibb.co/jkcJ05dg/IC-removebg-preview.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link *</label>
            <input
              type="text"
              required
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/category/integrated-circuits"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Subcategories */}
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Subcategories (Optional)</h4>
          {(formData.subcategories || []).map((sub, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-3 border border-gray-100 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory ID</label>
                <input
                  type="number"
                  value={sub.id || ''}
                  onChange={(e) => handleArrayChange('subcategories', index, 'id', parseInt(e.target.value) || '')}
                  placeholder="Auto-assigned"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={sub.name || ''}
                  onChange={(e) => handleArrayChange('subcategories', index, 'name', e.target.value)}
                  placeholder="e.g., Microcontrollers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={sub.description || ''}
                  onChange={(e) => handleArrayChange('subcategories', index, 'description', e.target.value)}
                  placeholder="e.g., Single-chip computers with CPU, memory, and I/O peripherals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link *</label>
                <input
                  type="text"
                  value={sub.link || ''}
                  onChange={(e) => handleArrayChange('subcategories', index, 'link', e.target.value)}
                  placeholder="/category/integrated-circuits/microcontrollers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveItem('subcategories', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  <MinusCircle size={16} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem('subcategories', { id: '', name: '', description: '', link: '' })}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <PlusCircle size={16} className="mr-2" /> Add Subcategory
          </button>
        </div>

        {/* Top Manufacturers */}
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Top Manufacturers (Optional)</h4>
          {(formData.topManufacturers || []).map((manufacturer, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-3 border border-gray-100 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input
                  type="number"
                  value={manufacturer.id || ''}
                  onChange={(e) => handleArrayChange('topManufacturers', index, 'id', parseInt(e.target.value) || '')}
                  placeholder="Auto-assigned"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={manufacturer.name || ''}
                  onChange={(e) => handleArrayChange('topManufacturers', index, 'name', e.target.value)}
                  placeholder="e.g., NXP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL *</label>
                <input
                  type="url"
                  value={manufacturer.logo || ''}
                  onChange={(e) => handleArrayChange('topManufacturers', index, 'logo', e.target.value)}
                  placeholder="https://example.com/nxp-logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={manufacturer.specialties ? manufacturer.specialties.join(', ') : ''}
                  onChange={(e) => handleArrayChange('topManufacturers', index, 'specialties', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., Microcontrollers, Automotive ICs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website *</label>
                <input
                  type="url"
                  value={manufacturer.website || ''}
                  onChange={(e) => handleArrayChange('topManufacturers', index, 'website', e.target.value)}
                  placeholder="https://www.nxp.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveItem('topManufacturers', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  <MinusCircle size={16} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem('topManufacturers', { id: '', name: '', logo: '', specialties: [], website: '' })}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <PlusCircle size={16} className="mr-2" /> Add Manufacturer
          </button>
        </div>

        {/* Popular Parts */}
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Popular Parts (Optional)</h4>
          <p className="text-sm text-gray-600 mb-4">Note: All fields are required if you add a popular part</p>
          {(formData.popularParts || []).map((part, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 border border-gray-100 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part ID</label>
                <input
                  type="number"
                  value={part.id || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'id', parseInt(e.target.value) || '')}
                  placeholder="Auto-assigned"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number *</label>
                <input
                  type="text"
                  value={part.partNumber || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'partNumber', e.target.value)}
                  placeholder="e.g., NE555P"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                <input
                  type="text"
                  value={part.manufacturer || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'manufacturer', e.target.value)}
                  placeholder="e.g., Texas Instruments"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={part.category || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'category', e.target.value)}
                  placeholder="e.g., Timers and Oscillators"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={part.description || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'description', e.target.value)}
                  placeholder="e.g., Single Bipolar Timer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  value={part.image || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'image', e.target.value)}
                  placeholder="https://example.com/ne555p.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="text"
                  value={part.price || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'price', e.target.value)}
                  placeholder="e.g., $0.45"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">In Stock</label>
                <input
                  type="checkbox"
                  checked={part.inStock || false}
                  onChange={(e) => handleArrayChange('popularParts', index, 'inStock', e.target.checked)}
                  className="ml-1 mt-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popularity (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={part.popularity || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'popularity', parseInt(e.target.value) || '')}
                  placeholder="e.g., 95"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link *</label>
                <input
                  type="text"
                  value={part.link || ''}
                  onChange={(e) => handleArrayChange('popularParts', index, 'link', e.target.value)}
                  placeholder="/parts/NE555P"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveItem('popularParts', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  <MinusCircle size={16} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem('popularParts', { id: '', partNumber: '', manufacturer: '', category: '', description: '', image: '', price: '', inStock: false, popularity: '', link: '' })}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <PlusCircle size={16} className="mr-2" /> Add Popular Part
          </button>
        </div>

        {/* Details Section */}
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Category Details</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={(formData.details && formData.details.description) || ''}
              onChange={(e) => handleDetailsChange('description', e.target.value)}
              placeholder="Integrated Circuits (ICs) are the foundation of modern electronics..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Applications */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Applications (Optional)</label>
            {((formData.details && formData.details.applications) || []).map((app, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={app || ''}
                  onChange={(e) => handleDetailsArrayChange('applications', index, e.target.value)}
                  placeholder="e.g., Microprocessors and microcontrollers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetailsArrayItem('applications', index)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddDetailsArrayItem('applications')}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
            >
              <PlusCircle size={14} className="mr-1" /> Add Application
            </button>
          </div>

          {/* Key Features */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (Optional)</label>
            {((formData.details && formData.details.keyFeatures) || []).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature || ''}
                  onChange={(e) => handleDetailsArrayChange('keyFeatures', index, e.target.value)}
                  placeholder="e.g., High integration density"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetailsArrayItem('keyFeatures', index)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddDetailsArrayItem('keyFeatures')}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
            >
              <PlusCircle size={14} className="mr-1" /> Add Key Feature
            </button>
          </div>

          {/* Market Info */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Info</label>
            <textarea
              rows="2"
              value={(formData.details && formData.details.marketInfo) || ''}
              onChange={(e) => handleDetailsChange('marketInfo', e.target.value)}
              placeholder="The global IC market is valued at over $500 billion..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Form Submission Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Save size={16} className="mr-2" />
            {loading ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;