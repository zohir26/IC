'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Cpu, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '@/Components/dashboard/Sidebar';
import BlogForm from '@/Components/dashboard/BlogForm';
import CategoryForm from '@/Components/dashboard/CategoryForm';
import DashboardContent from '@/Components/dashboard/DashboardContent';
import DataTable from '@/Components/dashboard/DataTable';
import Header from '@/Components/dashboard/Header';
import ManufacturerForm from '@/Components/dashboard/ManufacturerForm';
import ProductForm from '@/Components/dashboard/ProductForm';

const ICDashboard = () => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // State for CRUD operations
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Admin email check
  const isAdmin = session?.user?.email === "tanvir@gmail.com";

  // Navigation items
  const navigation = [
    { name: 'Dashboard', icon: 'Home', id: 'dashboard' },
    { name: 'All Products', icon: 'Package', id: 'all-products' },
    { name: 'All Categories', icon: 'Layers', id: 'all-categories' },
    { name: 'All Manufacturers', icon: 'Building2', id: 'all-manufacturers' },
    { name: 'All Blogs', icon: 'BookOpen', id: 'all-blogs' },
    { name: 'Add Product', icon: 'Plus', id: 'add-product' },
    { name: 'Add Category', icon: 'Plus', id: 'add-category' },
    { name: 'Add Manufacturer', icon: 'Plus', id: 'add-manufacturer' },
    { name: 'Add Blog', icon: 'Plus', id: 'add-blog' },
    { name: 'Settings', icon: 'Settings', id: 'settings' },
  ];

  // Redirect if not admin or not authenticated
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn();
      return;
    }
    
    if (session && !isAdmin) {
      window.location.href = '/unauthorized';
      return;
    }
  }, [session, status, isAdmin]);

  // Data fetching
  useEffect(() => {
    if (isAdmin && status === 'authenticated' && !showForm) {
      fetchData();
    }
  }, [activeTab, isAdmin, status, showForm]);

  const fetchData = async () => {
    if (showForm) return;
    
    setLoading(true);
    try {
      let res;
      let data;
      switch (activeTab) {
        case 'all-products':
          res = await fetch('/api/products');
          if (!res.ok) {
            console.error('Failed to fetch products:', res.status, res.statusText);
            setProducts([]);
            Swal.fire('Error', `Failed to load products: ${res.statusText}`, 'error');
            return;
          }
          data = await res.json();
          
          let extractedProducts = [];
          if (data.success && Array.isArray(data.brands)) {
            data.brands.forEach(brand => {
              if (brand.products && Array.isArray(brand.products)) {
                brand.products.forEach(product => {
                  extractedProducts.push({
                    ...product,
                    brandName: brand.name,
                    brandId: brand.brandId
                  });
                });
              }
            });
          } else if (data.success && Array.isArray(data.products)) {
            extractedProducts = data.products;
          } else if (Array.isArray(data)) {
            extractedProducts = data;
          }
          
          setProducts(extractedProducts);
          break;
          
        case 'all-categories':
          res = await fetch('/api/categories');
          if (!res.ok) {
            console.error('Failed to fetch categories:', res.status, res.statusText);
            setCategories([]);
            Swal.fire('Error', `Failed to load categories: ${res.statusText}`, 'error');
            return;
          }
          data = await res.json();
          
          let extractedCategories = [];
          if (data.success && Array.isArray(data.data)) {
            extractedCategories = data.data;
          } else if (data.success && Array.isArray(data.categories)) {
            extractedCategories = data.categories;
          } else if (Array.isArray(data)) {
            extractedCategories = data;
          }
          
          setCategories(extractedCategories);
          break;
          
        case 'all-manufacturers':
          res = await fetch('/api/brands');
          if (!res.ok) {
            console.error('Failed to fetch manufacturers (brands):', res.status, res.statusText);
            setManufacturers([]);
            Swal.fire('Error', `Failed to load manufacturers: ${res.statusText}`, 'error');
            return;
          }
          data = await res.json();
          
          let extractedBrands = [];
          if (data.success && Array.isArray(data.brands)) {
            extractedBrands = data.brands;
          } else if (data.success && Array.isArray(data.data)) {
            extractedBrands = data.data;
          } else if (Array.isArray(data)) {
            extractedBrands = data;
          }
          
          setManufacturers(extractedBrands);
          break;
          
        case 'all-blogs':
          res = await fetch('/api/blogs');
          if (!res.ok) {
            console.error('Failed to fetch blogs:', res.status, res.statusText);
            setBlogs([]);
            Swal.fire('Error', `Failed to load blogs: ${res.statusText}`, 'error');
            return;
          }
          data = await res.json();
          
          let extractedBlogs = [];
          if (data.success && Array.isArray(data.blogs)) {
            extractedBlogs = data.blogs;
          } else if (data.success && Array.isArray(data.data)) {
            extractedBlogs = data.data;
          } else if (Array.isArray(data)) {
            extractedBlogs = data;
          }
          
          setBlogs(extractedBlogs);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error in fetchData for ${activeTab}:`, error);
      Swal.fire('Error', `An unexpected error occurred while fetching data for ${activeTab}.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, type) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this ${type} deletion!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        let endpoint = '';
        switch (type) {
          case 'product':
            endpoint = `/api/products/${id}`;
            break;
          case 'category':
            endpoint = `/api/categories/${id}`;
            break;
          case 'manufacturer':
            // Find the manufacturer item to get the correct identifier
            const manufacturerItem = manufacturers.find(m => 
              m._id === id || m.brandId === id || m.id === id
            );
            const brandIdentifier = manufacturerItem?._id || manufacturerItem?.brandId || manufacturerItem?.name?.replace(/\s+/g, '-') || id;
            endpoint = `/api/brands/${brandIdentifier}`;
            break;
          case 'blog':
            endpoint = `/api/blogs/${id}`;
            break;
          default:
            Swal.fire('Error', 'Invalid type for deletion.', 'error');
            setLoading(false);
            return;
        }

        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok && (result.success === true || result.status === 'success')) {
          Swal.fire('Deleted!', `${type} has been deleted.`, 'success');
          fetchData();
        } else {
          Swal.fire('Error', result.message || 'Failed to delete', 'error');
        }
      } catch (error) {
        console.error('Error during deletion:', error);
        Swal.fire('Error', 'Something went wrong during deletion.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle submit
const handleSubmit = async (e, cleanedData = null) => {
  e.preventDefault();
  
  if (loading) return;
  
  setLoading(true);

  try {
    let endpoint = '';
    let method = editingItem ? 'PUT' : 'POST';
    
    const getId = (item) => {
      if (!item) return null;
      // For manufacturers, prioritize _id, then brandId, then other IDs
      if (activeTab === 'all-manufacturers' || activeTab === 'add-manufacturer') {
        return item._id || item.brandId || item.id || null;
      }
      return item._id || item.id || item.productId || item.brandId || null;
    };
    const handleSubmit = async (e, cleanedData = null) => {
  e.preventDefault();
  
  if (loading) return;
  
  setLoading(true);

  try {
    let endpoint = '';
    let method = editingItem ? 'PUT' : 'POST';
    
    const getId = (item) => {
      if (!item) return null;
      // For manufacturers, prioritize _id, then brandId, then other IDs
      if (activeTab === 'all-manufacturers' || activeTab === 'add-manufacturer') {
        return item._id || item.brandId || item.id || null;
      }
      return item._id || item.id || item.productId || item.brandId || null;
    };
    
    const itemId = getId(editingItem);

    // Use cleanedData if provided (from enhanced form), otherwise use formData
    let submissionData = cleanedData || { ...formData };

    // Enhanced logging for debugging
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Active Tab:', activeTab);
    console.log('Editing Item:', editingItem);
    console.log('Item ID:', itemId);
    console.log('Method:', method);
    console.log('Original Form Data:', formData);
    console.log('Submission Data:', submissionData);

    switch (activeTab) {
      case 'add-product':
      case 'all-products':
        endpoint = editingItem && itemId ? `/api/products/${itemId}` : '/api/products';
        break;
      case 'add-category':
      case 'all-categories':
        endpoint = editingItem && itemId ? `/api/categories/${itemId}` : '/api/categories';
        break;
      case 'add-manufacturer':
      case 'all-manufacturers':
        if (editingItem && itemId) {
          // Use the brand identifier (could be _id, brandId, or name)
          const brandIdentifier = editingItem._id || editingItem.brandId || editingItem.name?.replace(/\s+/g, '-');
          endpoint = `/api/brands/${brandIdentifier}`;
        } else {
          endpoint = '/api/brands';
        }
        
        // Enhanced data cleaning for manufacturers
        if (!cleanedData) {
          // Clean up specialties data for manufacturers
          if (submissionData.specialties) {
            submissionData.specialties = submissionData.specialties
              .filter(spec => spec && typeof spec === 'string' && spec.trim())
              .map(spec => spec.trim());
          }
          
          // Clean up products if they exist
          if (submissionData.products && Array.isArray(submissionData.products)) {
            submissionData.products = submissionData.products
              .filter(product => product.productId && product.name)
              .map(product => ({
                ...product,
                price: Number(product.price) || 0,
                stock: Number(product.stock) || 0,
                specifications: product.specifications || {},
                applications: Array.isArray(product.applications) ? product.applications : [],
                relatedProducts: Array.isArray(product.relatedProducts) ? product.relatedProducts : [],
                alternativeProducts: Array.isArray(product.alternativeProducts) ? product.alternativeProducts : []
              }));
          }
          
          // Remove MongoDB-generated fields for manufacturers
          const { _id, createdAt, updatedAt, __v, ...cleanManufacturerData } = submissionData;
          submissionData = cleanManufacturerData;
        }
        break;
      case 'add-blog':
      case 'all-blogs':
        endpoint = editingItem && itemId ? `/api/blogs/${itemId}` : '/api/blogs';
        
        if (!cleanedData) {
          // Remove MongoDB-generated fields that shouldn't be in the request
          const { _id, createdAt, updatedAt, __v, tagsString, ...cleanData } = submissionData;
          submissionData = cleanData;
          
          if (formData.tagsString) {
            submissionData.tags = formData.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else if (typeof submissionData.tags === 'string') {
            submissionData.tags = submissionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else if (!submissionData.tags || !Array.isArray(submissionData.tags)) {
            submissionData.tags = [];
          }
          
          submissionData.views = parseInt(submissionData.views, 10) || 0;
          submissionData.featured = Boolean(submissionData.featured);
          
          const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
          const missingFields = requiredFields.filter(field => {
            const value = submissionData[field];
            return !value || value.toString().trim().length === 0;
          });
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }
          
          if (submissionData.publishDate) {
            const date = new Date(submissionData.publishDate);
            if (!isNaN(date.getTime())) {
              submissionData.publishDate = date.toISOString();
            }
          }
        }
        break;
      default:
        throw new Error('Invalid tab for form submission.');
    }

    console.log('Final API Call Details:', {
      method,
      endpoint,
      editingItem: !!editingItem,
      itemId,
      activeTab,
      submissionData: submissionData
    });
    
    // Validate manufacturer data
    if (activeTab === 'add-manufacturer' || activeTab === 'all-manufacturers') {
      const { name, logo } = submissionData;
      if (!name || !logo) {
        throw new Error('Name and logo are required for manufacturers');
      }
      
      // Additional validation
      if (!name.trim()) {
        throw new Error('Manufacturer name cannot be empty');
      }
      
      try {
        new URL(logo);
      } catch {
        throw new Error('Logo must be a valid URL');
      }
      
      console.log('Manufacturer validation passed');
      console.log('Final manufacturer data:', submissionData);
    }

    // Make the API request
    console.log('Making API request to:', endpoint);
    console.log('Request method:', method);
    console.log('Request body:', JSON.stringify(submissionData, null, 2));

    const response = await fetch(endpoint, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData),
    });

    console.log('API Response status:', response.status);
    console.log('API Response ok:', response.ok);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    // Log the raw response text first
    const responseText = await response.text();
    console.log('Raw API Response length:', responseText.length);
    console.log('Raw API Response:', responseText);

    let result;
    try {
      // Only try to parse if we have content
      if (responseText && responseText.trim()) {
        result = JSON.parse(responseText);
        console.log('Parsed API Response data:', result);
      } else {
        console.warn('Empty response from server');
        result = { message: 'Empty response from server' };
      }
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response text was:', responseText);
      throw new Error(`Invalid response format from server. Status: ${response.status}, Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    }

    // Enhanced success detection
    const isSuccess = response.ok && (
      result.success === true || 
      result.status === 'success' || 
      response.status === 200 || 
      response.status === 201 ||
      (response.status >= 200 && response.status < 300)
    );
    
    console.log('Is success:', isSuccess);
    
    if (isSuccess) {
      console.log('Form submission successful');
      const successMessage = result.message || `${editingItem ? 'Updated' : 'Added'} successfully!`;
      
      // Use alert if Swal is not available
      if (typeof Swal !== 'undefined') {
        await Swal.fire('Success', successMessage, 'success');
      } else {
        alert('Success: ' + successMessage);
      }
      
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      
      // Call fetchData if it exists
      if (typeof fetchData === 'function') {
        fetchData();
      }
    } else {
      console.error('Form submission failed:', result);
      const errorMessage = result.message || result.error || `Server returned status ${response.status}`;
      
      // Use alert if Swal is not available
      if (typeof Swal !== 'undefined') {
        await Swal.fire('Error', errorMessage, 'error');
      } else {
        alert('Error: ' + errorMessage);
      }
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    console.error('Error stack:', error.stack);
    
    const errorMessage = error.message || 'Something went wrong during submission.';
    
    // Use alert if Swal is not available
    if (typeof Swal !== 'undefined') {
      await Swal.fire('Error', errorMessage, 'error');
    } else {
      alert('Error: ' + errorMessage);
    }
  } finally {
    setLoading(false);
    console.log('=== END FORM SUBMISSION DEBUG ===');
  }
};
    const itemId = getId(editingItem);

    // Use cleanedData if provided (from enhanced form), otherwise use formData
    let submissionData = cleanedData || { ...formData };

    // Enhanced logging for debugging
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Active Tab:', activeTab);
    console.log('Editing Item:', editingItem);
    console.log('Item ID:', itemId);
    console.log('Method:', method);
    console.log('Original Form Data:', formData);
    console.log('Submission Data:', submissionData);

    switch (activeTab) {
      case 'add-product':
      case 'all-products':
        endpoint = editingItem && itemId ? `/api/products/${itemId}` : '/api/products';
        break;
      case 'add-category':
      case 'all-categories':
        endpoint = editingItem && itemId ? `/api/categories/${itemId}` : '/api/categories';
        break;
      case 'add-manufacturer':
      case 'all-manufacturers':
        if (editingItem && itemId) {
          // Use the brand identifier (could be _id, brandId, or name)
          const brandIdentifier = editingItem._id || editingItem.brandId || editingItem.name?.replace(/\s+/g, '-');
          endpoint = `/api/brands/${brandIdentifier}`;
        } else {
          endpoint = '/api/brands';
        }
        
        // Enhanced data cleaning for manufacturers
        if (!cleanedData) {
          // Clean up specialties data for manufacturers
          if (submissionData.specialties) {
            submissionData.specialties = submissionData.specialties
              .filter(spec => spec && typeof spec === 'string' && spec.trim())
              .map(spec => spec.trim());
          }
          
          // Clean up products if they exist
          if (submissionData.products && Array.isArray(submissionData.products)) {
            submissionData.products = submissionData.products
              .filter(product => product.productId && product.name)
              .map(product => ({
                ...product,
                price: Number(product.price) || 0,
                stock: Number(product.stock) || 0,
                specifications: product.specifications || {},
                applications: Array.isArray(product.applications) ? product.applications : [],
                relatedProducts: Array.isArray(product.relatedProducts) ? product.relatedProducts : [],
                alternativeProducts: Array.isArray(product.alternativeProducts) ? product.alternativeProducts : []
              }));
          }
          
          // Remove MongoDB-generated fields for manufacturers
          const { _id, createdAt, updatedAt, __v, ...cleanManufacturerData } = submissionData;
          submissionData = cleanManufacturerData;
        }
        break;
      case 'add-blog':
      case 'all-blogs':
        endpoint = editingItem && itemId ? `/api/blogs/${itemId}` : '/api/blogs';
        
        if (!cleanedData) {
          // Remove MongoDB-generated fields that shouldn't be in the request
          const { _id, createdAt, updatedAt, __v, tagsString, ...cleanData } = submissionData;
          submissionData = cleanData;
          
          if (formData.tagsString) {
            submissionData.tags = formData.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else if (typeof submissionData.tags === 'string') {
            submissionData.tags = submissionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else if (!submissionData.tags || !Array.isArray(submissionData.tags)) {
            submissionData.tags = [];
          }
          
          submissionData.views = parseInt(submissionData.views, 10) || 0;
          submissionData.featured = Boolean(submissionData.featured);
          
          const requiredFields = ['title', 'author', 'category', 'publishDate', 'readTime', 'summary', 'content', 'img'];
          const missingFields = requiredFields.filter(field => {
            const value = submissionData[field];
            return !value || value.toString().trim().length === 0;
          });
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }
          
          if (submissionData.publishDate) {
            const date = new Date(submissionData.publishDate);
            if (!isNaN(date.getTime())) {
              submissionData.publishDate = date.toISOString();
            }
          }
        }
        break;
      default:
        throw new Error('Invalid tab for form submission.');
    }

    console.log('Final API Call Details:', {
      method,
      endpoint,
      editingItem: !!editingItem,
      itemId,
      activeTab,
      submissionData: submissionData
    });
    
    // Validate manufacturer data
    if (activeTab === 'add-manufacturer' || activeTab === 'all-manufacturers') {
      const { name, logo } = submissionData;
      if (!name || !logo) {
        throw new Error('Name and logo are required for manufacturers');
      }
      
      // Additional validation
      if (!name.trim()) {
        throw new Error('Manufacturer name cannot be empty');
      }
      
      try {
        new URL(logo);
      } catch {
        throw new Error('Logo must be a valid URL');
      }
      
      console.log('Manufacturer validation passed');
      console.log('Final manufacturer data:', submissionData);
    }

    // Make the API request
    console.log('Making API request to:', endpoint);
    console.log('Request method:', method);
    console.log('Request body:', JSON.stringify(submissionData, null, 2));

    const response = await fetch(endpoint, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData),
    });

    console.log('API Response status:', response.status);
    console.log('API Response ok:', response.ok);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    // Log the raw response text first
    const responseText = await response.text();
    console.log('Raw API Response length:', responseText.length);
    console.log('Raw API Response:', responseText);

    let result;
    try {
      // Only try to parse if we have content
      if (responseText && responseText.trim()) {
        result = JSON.parse(responseText);
        console.log('Parsed API Response data:', result);
      } else {
        console.warn('Empty response from server');
        result = { message: 'Empty response from server' };
      }
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response text was:', responseText);
      throw new Error(`Invalid response format from server. Status: ${response.status}, Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    }

    // Enhanced success detection
    const isSuccess = response.ok && (
      result.success === true || 
      result.status === 'success' || 
      response.status === 200 || 
      response.status === 201 ||
      (response.status >= 200 && response.status < 300)
    );
    
    console.log('Is success:', isSuccess);
    
    if (isSuccess) {
      console.log('Form submission successful');
      const successMessage = result.message || `${editingItem ? 'Updated' : 'Added'} successfully!`;
      
      // Use alert if Swal is not available
      if (typeof Swal !== 'undefined') {
        await Swal.fire('Success', successMessage, 'success');
      } else {
        alert('Success: ' + successMessage);
      }
      
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      
      // Call fetchData if it exists
      if (typeof fetchData === 'function') {
        fetchData();
      }
    } else {
      console.error('Form submission failed:', result);
      const errorMessage = result.message || result.error || `Server returned status ${response.status}`;
      
      // Use alert if Swal is not available
      if (typeof Swal !== 'undefined') {
        await Swal.fire('Error', errorMessage, 'error');
      } else {
        alert('Error: ' + errorMessage);
      }
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    console.error('Error stack:', error.stack);
    
    const errorMessage = error.message || 'Something went wrong during submission.';
    
    // Use alert if Swal is not available
    if (typeof Swal !== 'undefined') {
      await Swal.fire('Error', errorMessage, 'error');
    } else {
      alert('Error: ' + errorMessage);
    }
  } finally {
    setLoading(false);
    console.log('=== END FORM SUBMISSION DEBUG ===');
  }
};
  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    
    let editData = { ...item };
    
    if (activeTab === 'all-blogs' || activeTab === 'add-blog') {
      if (editData.tags && Array.isArray(editData.tags)) {
        editData.tagsString = editData.tags.join(', ');
      }
      
      if (editData.publishDate) {
        const date = new Date(editData.publishDate);
        if (!isNaN(date.getTime())) {
          editData.publishDate = date.toISOString().split('T')[0];
        }
      }
      
      editData.views = parseInt(editData.views, 10) || 0;
      editData.featured = Boolean(editData.featured);
    }
    
    // Handle manufacturers
    if (activeTab === 'all-manufacturers' || activeTab === 'add-manufacturer') {
      // Ensure specialties is an array
      if (!editData.specialties || !Array.isArray(editData.specialties)) {
        editData.specialties = [];
      }
    }
    
    setFormData(editData);
    setShowForm(true);
  };

  // Tab change handler
  const handleTabChange = (tabId) => {
    console.log('Tab changing to:', tabId);
    setActiveTab(tabId);
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
    
    // If switching to an "add" tab, show the form immediately
    if (['add-product', 'add-category', 'add-manufacturer', 'add-blog'].includes(tabId)) {
      console.log('Switching to add mode for:', tabId);
      setShowForm(true);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <Cpu className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">IC Dashboard Access</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the integrated circuits dashboard.</p>
          <button
            onClick={() => signIn()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <Shield className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this dashboard.</p>
          <div className="space-y-3">
            <Link href="/" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Go to Homepage
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        session={session}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          session={session}
          signOut={signOut}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardContent />
              </motion.div>
            )}

            {(activeTab === 'all-products' || activeTab === 'add-product') && (
              <motion.div
                key="products-crud"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Management</h1>
                {showForm || activeTab === 'add-product' ? (
                  <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    editingItem={editingItem}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                  />
                ) : (
                  <DataTable
                    data={products}
                    columns={[
                      { key: 'name', label: 'Product Name' },
                      { key: 'type', label: 'Type' },
                      { key: 'category', label: 'Category' },
                      { key: 'brandName', label: 'Brand', render: (val) => val || 'N/A' },
                      { key: 'price', label: 'Price', render: (price) => `${price?.toFixed(2) || '0.00'}` },
                      { key: 'availability', label: 'Availability', render: (val) => (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          val === 'In Stock' ? 'bg-green-100 text-green-800' :
                          val === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {val || 'Unknown'}
                        </span>
                      )},
                    ]}
                    type="product"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => setShowForm(true)}
                  />
                )}
              </motion.div>
            )}

            {(activeTab === 'all-categories' || activeTab === 'add-category') && (
              <motion.div
                key="categories-crud"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h1>
                {showForm || activeTab === 'add-category' ? (
                  <CategoryForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    editingItem={editingItem}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                  />
                ) : (
                  <DataTable
                    data={categories}
                    columns={[
                      { key: 'id', label: 'ID' },
                      { key: 'name', label: 'Category Name' },
                      { key: 'icon', label: 'Icon', render: (icon) => icon ? (
                        <img src={icon} alt="Category Icon" className="w-8 h-8 object-contain" />
                      ) : 'N/A' },
                      { key: 'link', label: 'Link', render: (link) => link || 'N/A' },
                    ]}
                    type="category"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => setShowForm(true)}
                  />
                )}
              </motion.div>
            )}

            {(activeTab === 'all-manufacturers' || activeTab === 'add-manufacturer') && (
              <motion.div
                key="manufacturers-crud"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Manufacturer Management</h1>
                {showForm || activeTab === 'add-manufacturer' ? (
                  <ManufacturerForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    editingItem={editingItem}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                  />
                ) : (
                  <DataTable
                    data={manufacturers}
                    columns={[
                      { key: 'brandId', label: 'Brand ID' },
                      { key: 'name', label: 'Manufacturer Name' },
                      { key: 'logo', label: 'Logo', render: (logo) => logo ? (
                        <img src={logo} alt="Manufacturer Logo" className="w-8 h-8 object-contain" />
                      ) : 'N/A' },
                      { key: 'website', label: 'Website', render: (website) => 
                        website ? (
                          <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit Site
                          </a>
                        ) : 'N/A'
                      },
                      { key: 'specialties', label: 'Specialties', render: (specialties) => 
                        specialties && Array.isArray(specialties) && specialties.length > 0 
                          ? specialties.join(', ') 
                          : 'N/A'
                      },
                    ]}
                    type="manufacturer"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => setShowForm(true)}
                  />
                )}
              </motion.div>
            )}

            {(activeTab === 'all-blogs' || activeTab === 'add-blog') && (
              <motion.div
                key="blogs-crud"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Blog Post Management</h1>
                {showForm || activeTab === 'add-blog' ? (
                  <BlogForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    editingItem={editingItem}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                  />
                ) : (
                  <DataTable
                    data={blogs}
                    columns={[
                      { key: 'id', label: 'ID' },
                      { key: 'title', label: 'Title', render: (title) => (
                        <div className="max-w-xs truncate" title={title}>{title}</div>
                      )},
                      { key: 'author', label: 'Author', render: (val) => val || 'N/A' },
                      { key: 'category', label: 'Category' },
                      { key: 'publishDate', label: 'Publish Date', render: (date) => 
                        date ? new Date(date).toLocaleDateString() : 'N/A'
                      },
                      { key: 'views', label: 'Views', render: (views) => views?.toLocaleString() || '0' },
                      { key: 'featured', label: 'Featured', render: (featured) => (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {featured ? 'Featured' : 'Regular'}
                        </span>
                      )},
                    ]}
                    type="blog"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => setShowForm(true)}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
                <p className="text-gray-700">Manage your dashboard settings here.</p>
              </motion.div>
            )}
                      </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ICDashboard;