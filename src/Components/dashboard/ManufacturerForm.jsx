import React from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const ManufacturerForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  editingItem, 
  onCancel 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingItem ? 'Edit Manufacturer' : 'Add New Manufacturer'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., NXP, Texas Instruments"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={formData.logo || ''}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
              placeholder="https://example.com/nxp-logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="https://www.nxp.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={formData.country || ''}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              placeholder="e.g., Netherlands"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
            <input
              type="number"
              value={formData.foundedYear || ''}
              onChange={(e) => setFormData({...formData, foundedYear: parseInt(e.target.value)})}
              placeholder="e.g., 1953"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
            <input
              type="text"
              value={formData.headquarters || ''}
              onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
              placeholder="e.g., Eindhoven, Netherlands"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows="3"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of the manufacturer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
          <div className="space-y-2">
            {(formData.specialties || []).map((specialty, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={specialty}
                  placeholder="e.g., Microcontrollers, Automotive ICs"
                  onChange={(e) => {
                    const newSpecialties = [...(formData.specialties || [])];
                    newSpecialties[index] = e.target.value;
                    setFormData({...formData, specialties: newSpecialties});
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSpecialties = formData.specialties.filter((_, i) => i !== index);
                    setFormData({...formData, specialties: newSpecialties});
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
                const newSpecialties = [...(formData.specialties || []), ''];
                setFormData({...formData, specialties: newSpecialties});
              }}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              <Plus size={16} className="inline mr-1" />
              Add Specialty
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

export default ManufacturerForm;