import React from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const ProductForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  editingItem, 
  onCancel 
}) => {
  return (
    <div className="bg-white p-6 mb-20 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingItem ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6 mb-16">
        {/* Basic Product Information */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., BME280 Pressure Sensor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brandName || ''}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                placeholder="e.g., Analog device"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <input
                type="text"
                required
                value={formData.type || ''}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                placeholder="e.g., Sensor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Environmental Sensors"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                placeholder="e.g., 6.80"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
              <select
                value={formData.availability || 'In Stock'}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Limited Stock">Limited Stock</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://img.icons8.com/color/48/000000/pressure.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datasheet URL</label>
              <input
                type="url"
                value={formData.datasheet || ''}
                onChange={(e) => setFormData({...formData, datasheet: e.target.value})}
                placeholder="https://example.com/bme280-datasheet.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                placeholder="https://www.youtube.com/embed/OgcQtOfq3ZI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Product description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Specifications</h4>
          <div className="space-y-3">
            {Object.entries(formData.specifications || {}).map(([key, value], index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Specification key (e.g., pressureRange)"
                  value={key}
                  onChange={(e) => {
                    const newSpecs = {...(formData.specifications || {})};
                    delete newSpecs[key];
                    newSpecs[e.target.value] = value;
                    setFormData({...formData, specifications: newSpecs});
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Value (e.g., 300 to 1100 hPa)"
                    value={value}
                    onChange={(e) => {
                      const newSpecs = {...(formData.specifications || {})};
                      newSpecs[key] = e.target.value;
                      setFormData({...formData, specifications: newSpecs});
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSpecs = {...(formData.specifications || {})};
                      delete newSpecs[key];
                      setFormData({...formData, specifications: newSpecs});
                    }}
                    className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSpecs = {...(formData.specifications || {}), '': ''};
                setFormData({...formData, specifications: newSpecs});
              }}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              <Plus size={16} className="inline mr-1" />
              Add Specification
            </button>
          </div>
        </div>

        {/* Applications */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Applications</h4>
          <div className="space-y-2">
            {(formData.applications || []).map((app, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={app}
                  placeholder="e.g., Weather Stations"
                  onChange={(e) => {
                    const newApps = [...(formData.applications || [])];
                    newApps[index] = e.target.value;
                    setFormData({...formData, applications: newApps});
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newApps = formData.applications.filter((_, i) => i !== index);
                    setFormData({...formData, applications: newApps});
                  }}
                  className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newApps = [...(formData.applications || []), ''];
                setFormData({...formData, applications: newApps});
              }}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              <Plus size={16} className="inline mr-1" />
              Add Application
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Features</h4>
          <div className="space-y-2">
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={feature}
                  placeholder="e.g., 3-in-1 Sensor"
                  onChange={(e) => {
                    const newFeatures = [...(formData.features || [])];
                    newFeatures[index] = e.target.value;
                    setFormData({...formData, features: newFeatures});
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index);
                    setFormData({...formData, features: newFeatures});
                  }}
                  className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newFeatures = [...(formData.features || []), ''];
                setFormData({...formData, features: newFeatures});
              }}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              <Plus size={16} className="inline mr-1" />
              Add Feature
            </button>
          </div>
        </div>
        {/* Documents */}
<div className="border-b border-gray-200 pb-4">
  <h4 className="text-md font-semibold text-gray-800 mb-3">Documents</h4>
  <div className="space-y-3">
    {(formData.documents || []).map((doc, index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Document Label (e.g., User Manual)"
          value={doc.label}
          onChange={(e) => {
            const newDocs = [...(formData.documents || [])];
            newDocs[index].label = e.target.value;
            setFormData({ ...formData, documents: newDocs });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="Document URL"
            value={doc.url}
            onChange={(e) => {
              const newDocs = [...(formData.documents || [])];
              newDocs[index].url = e.target.value;
              setFormData({ ...formData, documents: newDocs });
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              const newDocs = formData.documents.filter((_, i) => i !== index);
              setFormData({ ...formData, documents: newDocs });
            }}
            className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => {
        const newDocs = [...(formData.documents || []), { label: '', url: '' }];
        setFormData({ ...formData, documents: newDocs });
      }}
      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600"
    >
      <Plus size={16} className="inline mr-1" />
      Add Document
    </button>
  </div>
</div>

        <div className="flex space-x-3">
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

export default ProductForm;