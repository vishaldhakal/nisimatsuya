import axiosInstance from '../../lib/api/axiosInstance';

const handleError = (error, defaultMsg) => {
  const data = error.response?.data;
  if (data) {
    if (typeof data === 'object') {
      if (data.detail) throw new Error(data.detail);
      const msgs = Object.entries(data)
        .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(', ') : m}`)
        .join('; ');
      if (msgs) throw new Error(msgs);
    }
    if (typeof data === 'string') throw new Error(data);
  }
  throw new Error(data?.message || error.message || defaultMsg);
};

export const addCategory = async (data) => {
  try {
    const res = await axiosInstance.get('/api/categories/', data);
    return res.data;
  } catch (e) { handleError(e, 'Failed to add category'); }
};

export const editCategory = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/categories/${id}/`, data);
    return res.data;
  } catch (e) { handleError(e, 'Failed to edit category'); }
};

export const fetchCategory = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/categories/${id}/`);
    return res.data;
  } catch (e) { handleError(e, 'Failed to fetch category'); }
};

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get('/api/categories/');
    return res.data;
  } catch (e) { handleError(e, 'Failed to fetch categories'); }
};

export const fetchProductsByCategory = async (categorySlug, priceRange = null) => {
  try {
    let url = `/api/products/?category=${categorySlug}`;
    
    if (priceRange) {
      url += `&min_price=${priceRange.min}&max_price=${priceRange.max}`;
    }
    
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (e) { 
    handleError(e, 'Failed to fetch products by category');
    return [];
  }
};

export const fetchAllProducts = async (priceRange = null, searchQuery = null) => {
  try {
    let url = '/api/products/';
    const params = new URLSearchParams();
    
    if (priceRange) {
      params.append('min_price', priceRange.min);
      params.append('max_price', priceRange.max);
    }
    
    if (searchQuery && searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to fetch all products');
    return [];
  }
};


export const searchProducts = async (searchQuery, priceRange = null, categorySlug = null) => {
  try {
    const params = new URLSearchParams();
    
    if (searchQuery && searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (priceRange) {
      params.append('min_price', priceRange.min);
      params.append('max_price', priceRange.max);
    }
    
    if (categorySlug && categorySlug !== 'all') {
      params.append('category', categorySlug);
    }
    
    const url = `/api/products/?${params.toString()}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to search products');
    return [];
  }
};