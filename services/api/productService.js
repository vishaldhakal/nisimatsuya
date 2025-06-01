import axiosInstance from "../../lib/api/axiosInstance";

const handleError = (error, defaultMsg) => {
  console.error('API Error:', error.response?.data || error.message);
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

const generateSlug = (name) =>
  name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const cleanProductData = (d) => {
  const cleaned = {
    name: String(d.name || '').trim(),
    description: String(d.description || '').trim(),
    market_price: parseFloat(d.market_price) || 0,
    price: parseFloat(d.price) || 0,
    stock: parseInt(d.stock) || 0,
    category: parseInt(d.category) || null,
    is_popular: Boolean(d.is_popular),
    is_featured: Boolean(d.is_featured),
    is_active: Boolean(d.is_active),
    discount: parseFloat(d.discount) || 0,
    slug: String(d.slug || '').trim(),
  };
  if (!cleaned.slug && cleaned.name) cleaned.slug = generateSlug(cleaned.name);
  if (!cleaned.name) throw new Error('Product name is required');
  if (!cleaned.category) throw new Error('Category is required');
  if (cleaned.price <= 0) throw new Error('Price must be greater than 0');
  return cleaned;
};

const base64ToBlob = (base64, mime) => {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const hasValidImages = (imgs) =>
  imgs && imgs.length > 0 && imgs.some(img => img.file || (img.image && img.image.startsWith('data:')));

const hasValidThumbnail = (thumbnail) => {
  if (!thumbnail) return false;
  if (thumbnail instanceof File) return true;
  if (thumbnail.file instanceof File) return true;
  if (thumbnail.image && thumbnail.image.startsWith('data:')) return true;
  return false;
};

const appendImagesToFormData = (formData, images) => {
  if (!images || !Array.isArray(images)) return;
  images.forEach((img, i) => {
    if (img.file) {
      formData.append('images', img.file);
    } else if (img.image && img.image.startsWith('data:')) {
      const [meta, base64] = img.image.split(',');
      const mime = meta.split(':')[1].split(';')[0];
      formData.append('images', base64ToBlob(base64, mime), img.name || `image_${i}.jpg`);
    }
  });
};

const appendThumbnailToFormData = (formData, thumbnail) => {
  if (!thumbnail) return;
  if (thumbnail instanceof File) {
    formData.append('thumbnail_image', thumbnail);
    return;
  }
  if (thumbnail.file instanceof File) {
    formData.append('thumbnail_image', thumbnail.file);
    return;
  }
  if (thumbnail.image && thumbnail.image.startsWith('data:')) {
    const [meta, base64] = thumbnail.image.split(',');
    const mime = meta.split(':')[1].split(';')[0];
    const blob = base64ToBlob(base64, mime);
    formData.append('thumbnail_image', blob, thumbnail.name || 'thumbnail.jpg');
    return;
  }
  if (thumbnail.image && typeof thumbnail.image === 'string') {
    formData.append('thumbnail_image', thumbnail.image);
  }
};

const getCategorySlugById = async (categoryId) => {
  try {
    const response = await axiosInstance.get('/api/categories/');
    const category = response.data.find(cat => cat.id === categoryId);
    return category ? category.slug : null;
  } catch (e) {
    console.error('Error fetching category:', e);
    return null;
  }
};



export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/products/');
    return response.data;
  } catch (e) {
    handleError(e, 'Failed to fetch products');
  }
};

export const fetchProductByCategoryAndSlug = async (category_slug, slug) => {
  try {
    const res = await axiosInstance.get(`/api/products/${category_slug}/${slug}/`);
    return res.data;
  } catch (e) { 
    handleError(e, 'Failed to fetch product'); 
  }
};


export const fetchProductBySlug = async (slug) => {
  try {
  
    const products = await fetchProducts();
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // If product has category_slug, use it directly
    if (product.category_slug) {
      return await fetchProductByCategoryAndSlug(product.category_slug, slug);
    }
    
    // Otherwise, fetch category info
    const categorySlug = await getCategorySlugById(product.category);
    if (!categorySlug) {
      throw new Error('Product category not found');
    }
    
    return await fetchProductByCategoryAndSlug(categorySlug, slug);
    
  } catch (e) { 
    handleError(e, 'Failed to fetch product'); 
  }
};

export const fetchProductById = async (id) => {
  try {
    const products = await fetchProducts();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    
    // Use the proper category + slug method
    if (product.category_slug) {
      return await fetchProductByCategoryAndSlug(product.category_slug, product.slug);
    }
    
    const categorySlug = await getCategorySlugById(product.category);
    if (!categorySlug) {
      throw new Error('Product category not found');
    }
    
    return await fetchProductByCategoryAndSlug(categorySlug, product.slug);
  } catch (e) { 
    handleError(e, 'Failed to fetch product'); 
  }
};

export const fetchProduct = fetchProductById;

// DELETE PRODUCT - Uses category_slug + slug (CORRECT APPROACH)
export const deleteProduct = async (category_slug, slug) => {
  try {
    await axiosInstance.delete(`/api/products/${category_slug}/${slug}/`);
    return { success: true, message: 'Product deleted successfully' };
  } catch (e) { 
    console.error('Error deleting product:', e);
    handleError(e, 'Failed to delete product'); 
  }
};

// ADD PRODUCT
export const addProduct = async (data) => {
  try {
    const { images, id, meta_title, meta_description, thumbnail_image, ...productData } = data;
    const cleanData = cleanProductData(productData);

    if (meta_title !== undefined) cleanData.meta_title = meta_title;
    if (meta_description !== undefined) cleanData.meta_description = meta_description;

    const hasImages = hasValidImages(images);
    const hasThumbnail = hasValidThumbnail(thumbnail_image);
    
    if (hasImages || hasThumbnail) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key === 'category' ? 'category_id' : key, value);
        }
      });
 
      if (hasImages) {
        appendImagesToFormData(formData, images);
      }
      if (hasThumbnail) {
        appendThumbnailToFormData(formData, thumbnail_image);
      }

      return (await axiosInstance.post('/api/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
        timeout: 30000,
      })).data;
    } else {
      const jsonData = { ...cleanData, category_id: cleanData.category };
      delete jsonData.category;
      
      return (await axiosInstance.post('/api/products/', jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })).data;
    }
  } catch (e) { 
    console.error('Error adding product:', e); 
    handleError(e, 'Failed to add product'); 
  }
};

// EDIT PRODUCT - Uses category_slug + slug (CORRECT APPROACH)
export const editProduct = async (category_slug, slug, data) => {
  try {
    const { images, meta_title, meta_description, thumbnail_image, ...productData } = data;
    const cleanData = cleanProductData(productData);

    if (meta_title !== undefined) cleanData.meta_title = meta_title;
    if (meta_description !== undefined) cleanData.meta_description = meta_description;

    const hasImages = hasValidImages(images);
    const hasNewThumbnail = hasValidThumbnail(thumbnail_image) && 
                           (!thumbnail_image.isExisting || thumbnail_image.file);

    const useFormData = hasImages || hasNewThumbnail;

    if (useFormData) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      if (hasImages) appendImagesToFormData(formData, images);
      if (hasNewThumbnail) appendThumbnailToFormData(formData, thumbnail_image);

      return (await axiosInstance.patch(`/api/products/${category_slug}/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
        timeout: 30000,
      })).data;
    } else {
      const jsonData = { 
        ...cleanData, 
        thumbnail_image: thumbnail_image?.image || null
      };
      delete jsonData.category;
      return (await axiosInstance.patch(`/api/products/${category_slug}/${slug}/`, jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })).data;
    }
  } catch (e) { 
    console.error('Error editing product:', e); 
    handleError(e, 'Failed to edit product'); 
  }
};


export const fetchSimilarProducts = async ( slug) => {
    try {
      const res = await axiosInstance.get(`/api/products/${slug}/similar/`);
      return res.data;
    } catch (e2) {
      console.error('Error fetching similar products:', e2);
      return []; 
    }
  }




