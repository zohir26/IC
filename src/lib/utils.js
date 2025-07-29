import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const unslugify = (slug) => {
  if (!slug) return '';
  return slug.replace(/-/g, ' ');
};

export const getRelatedProducts = (currentProduct, allProducts, limit = 4) => {
  if (!currentProduct || !allProducts) return [];
  
  return allProducts
    .filter(product => {
      // Exclude the current product
      if (product.productId === currentProduct.productId) return false;
      
      // Match by category or type
      const sameCategory = product.category && currentProduct.category && 
        product.category.toLowerCase() === currentProduct.category.toLowerCase();
      
      const sameType = product.type && currentProduct.type && 
        product.type.toLowerCase() === currentProduct.type.toLowerCase();
      
      return sameCategory || sameType;
    })
    .sort((a, b) => {
      // Prioritize products with same category over same type
      const aCategory = a.category && currentProduct.category && 
        a.category.toLowerCase() === currentProduct.category.toLowerCase();
      const bCategory = b.category && currentProduct.category && 
        b.category.toLowerCase() === currentProduct.category.toLowerCase();
      
      if (aCategory && !bCategory) return -1;
      if (!aCategory && bCategory) return 1;
      
      // Then sort by price similarity
      const aPriceDiff = Math.abs(a.price - currentProduct.price);
      const bPriceDiff = Math.abs(b.price - currentProduct.price);
      
      return aPriceDiff - bPriceDiff;
    })
    .slice(0, limit);
};

export const getAlternativeProducts = (currentProduct, allProducts, limit = 4) => {
  if (!currentProduct || !allProducts) return [];
  
  const priceRange = currentProduct.price * 0.4; // 40% price tolerance
  
  return allProducts
    .filter(product => {
      // Exclude the current product
      if (product.productId === currentProduct.productId) return false;
      
      // Different category but similar price range
      const differentCategory = !product.category || !currentProduct.category || 
        product.category.toLowerCase() !== currentProduct.category.toLowerCase();
      
      const similarPrice = Math.abs(product.price - currentProduct.price) <= priceRange;
      
      return differentCategory && similarPrice;
    })
    .sort((a, b) => {
      // Sort by price similarity
      const aPriceDiff = Math.abs(a.price - currentProduct.price);
      const bPriceDiff = Math.abs(b.price - currentProduct.price);
      
      return aPriceDiff - bPriceDiff;
    })
    .slice(0, limit);
};

// API utility class
export const api = {
  async get(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async put(url, data) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async delete(url) {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

