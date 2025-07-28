import React, { useState } from 'react';
import { Save, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ManufacturerForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  editingItem, 
  onCancel 
}) => {
  const [showProductsSection, setShowProductsSection] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState({});

  // Enhanced validation with detailed error messages
  const validateForm = () => {
    const errors = [];
    
    if (!formData.name?.trim()) {
      errors.push('Manufacturer name is required');
    }
    
    if (!formData.logo?.trim()) {
      errors.push('Logo URL is required');
    } else {
      // Basic URL validation
      try {
        new URL(formData.logo);
      } catch {
        errors.push('Logo URL must be a valid URL');
      }
    }
    
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website);
      } catch {
        errors.push('Website must be a valid URL');
      }
    }
    
    // Validate products if any exist
    if (formData.products && formData.products.length > 0) {
      formData.products.forEach((product, index) => {
        if (!product.productId?.trim()) {
          errors.push(`Product ${index + 1}: Product ID is required`);
        }
        if (!product.name?.trim()) {
          errors.push(`Product ${index + 1}: Product name is required`);
        }
        if (product.price && (isNaN(product.price) || product.price < 0)) {
          errors.push(`Product ${index + 1}: Price must be a valid positive number`);
        }
        if (product.stock && (isNaN(product.stock) || product.stock < 0)) {
          errors.push(`Product ${index + 1}: Stock must be a valid positive number`);
        }
        if (product.image && product.image.trim()) {
          try {
            new URL(product.image);
          } catch {
            errors.push(`Product ${index + 1}: Image URL must be valid`);
          }
        }
      });
    }
    
    return errors;
  };

  const isFormValid = () => {
    const errors = validateForm();
    return errors.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (index, value) => {
    const newSpecialties = [...(formData.specialties || [])];
    newSpecialties[index] = value;
    setFormData(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const addSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...(prev.specialties || []), '']
    }));
  };

  const removeSpecialty = (index) => {
    const newSpecialties = (formData.specialties || []).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const addProduct = () => {
    const newProduct = {
      productId: '',
      name: '',
      category: '',
      description: '',
      specifications: {},
      price: 0,
      stock: 0,
      image: '',
      datasheet: '',
      applications: [],
      relatedProducts: [],
      alternativeProducts: []
    };
    setFormData(prev => ({
      ...prev,
      products: [...(prev.products || []), newProduct]
    }));
  };

  const removeProduct = (index) => {
    const newProducts = (formData.products || []).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...(formData.products || [])];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!newProducts[index][parent]) newProducts[index][parent] = {};
      newProducts[index][parent][child] = value;
    } else {
      newProducts[index][field] = value;
    }
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const toggleProductExpansion = (index) => {
    setExpandedProducts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Enhanced submit handler with better data cleaning
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Raw form data:', formData);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    // Clean and prepare the data
    const cleanedData = {
      name: formData.name?.trim(),
      logo: formData.logo?.trim(),
      description: formData.description?.trim() || '',
      website: formData.website?.trim() || '',
      specialties: (formData.specialties || [])
        .map(s => s?.trim())
        .filter(s => s && s.length > 0),
    };

    // Only include products if they exist and are valid
    if (formData.products && formData.products.length > 0) {
      cleanedData.products = formData.products
        .filter(product => product.productId?.trim() && product.name?.trim())
        .map(product => ({
          productId: product.productId.trim(),
          name: product.name.trim(),
          category: product.category?.trim() || '',
          description: product.description?.trim() || '',
          specifications: product.specifications || {},
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          image: product.image?.trim() || '',
          datasheet: product.datasheet?.trim() || '',
          applications: (product.applications || [])
            .map(app => app?.trim())
            .filter(app => app && app.length > 0),
          relatedProducts: (product.relatedProducts || [])
            .map(rel => rel?.trim())
            .filter(rel => rel && rel.length > 0),
          alternativeProducts: (product.alternativeProducts || [])
            .filter(alt => alt.productId?.trim() && alt.name?.trim())
            .map(alt => ({
              productId: alt.productId.trim(),
              name: alt.name.trim(),
              brandName: alt.brandName?.trim() || '',
              category: alt.category?.trim() || '',
              price: Number(alt.price) || 0,
              stock: Number(alt.stock) || 0,
              image: alt.image?.trim() || ''
            }))
        }));
    } else {
      cleanedData.products = [];
    }

    console.log('Cleaned form data:', cleanedData);
    
    // Call the parent's onSubmit with cleaned data
    onSubmit(e, cleanedData);
  };

  const formErrors = validateForm();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? 'Edit Manufacturer' : 'Add New Manufacturer'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Show validation errors */}
        {formErrors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter manufacturer name"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL *
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="https://example.com/logo.png"
              required
              disabled={loading}
            />
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain border border-gray-200 rounded"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
            placeholder="Enter manufacturer description"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="https://manufacturer-website.com"
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Specialties</label>
            <button
              type="button"
              onClick={addSpecialty}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Specialty
            </button>
          </div>
          {(formData.specialties || []).map((specialty, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={specialty || ''}
                onChange={(e) => handleSpecialtiesChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter specialty"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeSpecialty(index)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {(!formData.specialties || formData.specialties.length === 0) && (
            <p className="text-sm text-gray-500 italic">No specialties added yet. Click "Add Specialty" to add one.</p>
          )}
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowProductsSection(!showProductsSection)}
              className="flex items-center text-lg font-medium text-gray-900"
            >
              {showProductsSection ? <ChevronUp className="h-5 w-5 mr-2" /> : <ChevronDown className="h-5 w-5 mr-2" />}
              Products ({(formData.products || []).length})
            </button>
            {showProductsSection && (
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </button>
            )}
          </div>
          {showProductsSection && (
            <div className="space-y-6">
              {(formData.products || []).map((product, productIndex) => (
                <div key={productIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => toggleProductExpansion(productIndex)}
                      className="flex items-center text-lg font-medium text-gray-900"
                    >
                      {expandedProducts[productIndex] ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                      Product {productIndex + 1}: {product.name || 'Unnamed Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(productIndex)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  {expandedProducts[productIndex] && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                          <input
                            type="text"
                            placeholder="MUR001"
                            value={product.productId || ''}
                            onChange={(e) => updateProduct(productIndex, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                          <input
                            type="text"
                            placeholder="GRM155R71C104KA88D"
                            value={product.name || ''}
                            onChange={(e) => updateProduct(productIndex, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            placeholder="Ceramic Capacitor"
                            value={product.category || ''}
                            onChange={(e) => updateProduct(productIndex, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.15"
                            value={product.price || ''}
                            onChange={(e) => updateProduct(productIndex, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="5000"
                            value={product.stock || ''}
                            onChange={(e) => updateProduct(productIndex, 'stock', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="url"
                            placeholder="https://via.placeholder.com/300x200?text=Product"
                            value={product.image || ''}
                            onChange={(e) => updateProduct(productIndex, 'image', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          placeholder="0402 size 100nF ceramic capacitor with X7R dielectric"
                          value={product.description || ''}
                          onChange={(e) => updateProduct(productIndex, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(!formData.products || formData.products.length === 0) && (
                <p className="text-sm text-gray-500 italic text-center py-8">No products added yet. Click "Add Product" to add one.</p>
              )}
            </div>
          )}
        </div>

        {/* Debug information */}
        <div className="border-t pt-6">
          <details className="bg-gray-50 p-4 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">Debug Information</summary>
            <div className="mt-2 space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Form Valid:</strong> {isFormValid() ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Validation Errors:</strong> {formErrors.length === 0 ? 'None' : formErrors.join(', ')}
              </div>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40 bg-white p-2 rounded border">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        <div className="mb-20 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={loading || !isFormValid()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingItem ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Update Manufacturer' : 'Create Manufacturer'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerForm;