// hooks/useCategories.js - Custom React Hook for Categories
import { useState, useEffect } from 'react';

export function useCategories(options = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { search, limit, page, useAPI = true } = options;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        let url;
        if (useAPI) {
          // Use API endpoint
          const params = new URLSearchParams();
          if (search) params.append('search', search);
          if (limit) params.append('limit', limit);
          if (page) params.append('page', page);
          
          url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`;
        } else {
          // Use static JSON file
          url = '/categories.json';
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const result = await response.json();
        const data = useAPI ? result.data : result;
        
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [search, limit, page, useAPI]);

  return { categories, loading, error };
}

export function useCategory(categoryId, useAPI = true) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setLoading(false);
        setError('Category ID is required');
        return;
      }

      setLoading(true);
      try {
        let url;
        let data;

        if (useAPI) {
          // Use API endpoint
          url = `/api/categories/${categoryId}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch category');
          }
          const result = await response.json();
          data = result.data;
        } else {
          // Use static JSON file
          url = '/categories.json';
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const categories = await response.json();
          data = categories.find(cat => cat.id.toString() === categoryId.toString());
          
          if (!data) {
            throw new Error('Category not found');
          }
        }
        
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, useAPI]);

  return { category, loading, error };
}