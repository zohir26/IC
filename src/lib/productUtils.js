// lib/productUtils.js - Utility functions for product operations

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

export const getCategorizedProducts = (products) => {
  if (!products || products.length === 0) return {};
  
  return products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
};

export const getProductsByType = (products) => {
  if (!products || products.length === 0) return {};
  
  return products.reduce((acc, product) => {
    const type = product.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});
};

export const searchProducts = (products, searchTerm) => {
  if (!products || !searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  
  return products.filter(product => {
    return (
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.type?.toLowerCase().includes(term) ||
      product.productId?.toString().includes(term)
    );
  });
};

export const filterProductsByPriceRange = (products, minPrice, maxPrice) => {
  if (!products) return [];
  
  return products.filter(product => {
    const price = product.price || 0;
    return price >= minPrice && price <= maxPrice;
  });
};

export const sortProducts = (products, sortBy = 'name', sortOrder = 'asc') => {
  if (!products) return [];
  
  return [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'category':
        aValue = a.category?.toLowerCase() || '';
        bValue = b.category?.toLowerCase() || '';
        break;
      case 'productId':
        aValue = a.productId || 0;
        bValue = b.productId || 0;
        break;
      default:
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getProductStats = (products) => {
  if (!products || products.length === 0) {
    return {
      total: 0,
      categories: 0,
      types: 0,
      priceRange: { min: 0, max: 0, average: 0 }
    };
  }
  
  const categories = new Set(products.map(p => p.category).filter(Boolean));
  const types = new Set(products.map(p => p.type).filter(Boolean));
  const prices = products.map(p => p.price || 0).filter(price => price > 0);
  
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    average: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0
  };
  
  return {
    total: products.length,
    categories: categories.size,
    types: types.size,
    priceRange
  };
};