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

const appendImagesToFormData = (formData, images) => {
  images.forEach((img, i) => {
    if (img.file) formData.append('images', img.file);
    else if (img.image && img.image.startsWith('data:')) {
      const [meta, base64] = img.image.split(',');
      const mime = meta.split(':')[1].split(';')[0];
      formData.append('images', base64ToBlob(base64, mime), img.name || `image_${i}.jpg`);
    }
  });
};

export const fetchProducts = async () => (await axiosInstance.get('/api/products/')).data;

export const fetchProductBySlug = async (slug) => {
  try {
    const res = await axiosInstance.get(`/api/products/${slug}/`);
    return res.data;
  } catch (e) { handleError(e, 'Failed to fetch product'); }
};

export const fetchProductById = async (id) => {
  try {
    const products = await fetchProducts();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return await fetchProductBySlug(product.slug);
  } catch (e) { handleError(e, 'Failed to fetch product'); }
};

export const fetchProduct = fetchProductById;

export const addProduct = async (data) => {
  try {
    const { images, id, meta_title, meta_description, thumbnail_image, ...productData } = data;
    const cleanData = cleanProductData(productData);

    // Add meta fields
    if (meta_title !== undefined) cleanData.meta_title = meta_title;
    if (meta_description !== undefined) cleanData.meta_description = meta_description;

    // Always use FormData if thumbnail_image or images exist
    if ((images && images.length > 0) || thumbnail_image) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value !== null && value !== undefined)
          formData.append(key === 'category' ? 'category_id' : key, value);
      });
      appendImagesToFormData(formData, images);

      // Handle thumbnail_image
      if (thumbnail_image) {
        if (thumbnail_image.file) {
          formData.append('thumbnail_image', thumbnail_image.file);
        } else if (thumbnail_image.image && thumbnail_image.image.startsWith('data:')) {
          const [meta, base64] = thumbnail_image.image.split(',');
          const mime = meta.split(':')[1].split(';')[0];
          formData.append('thumbnail_image', base64ToBlob(base64, mime), thumbnail_image.name || 'thumbnail.jpg');
        }
      }

      return (await axiosInstance.post('/api/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
      })).data;
    } else {
      // Only use JSON if there are no images and no thumbnail_image
      const jsonData = { ...cleanData, category_id: cleanData.category };
      delete jsonData.category;
      return (await axiosInstance.post('/api/products/', jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })).data;
    }
  } catch (e) { console.error('Error adding product:', e); handleError(e, 'Failed to add product'); }
};

export const editProduct = async (id, data) => {
  try {
    const { images, meta_title, meta_description, thumbnail_image, ...productData } = data;
    const cleanData = cleanProductData(productData);
    const product = await fetchProductById(id);
    const slug = product.slug;

    // Add meta fields
    if (meta_title !== undefined) cleanData.meta_title = meta_title;
    if (meta_description !== undefined) cleanData.meta_description = meta_description;

    if (hasValidImages(images) || thumbnail_image) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value !== null && value !== undefined)
          formData.append(key, String(value));
      });
      appendImagesToFormData(formData, images);

      // Handle thumbnail_image
      if (thumbnail_image) {
        if (thumbnail_image.file) {
          formData.append('thumbnail_image', thumbnail_image.file);
        } else if (thumbnail_image.image && thumbnail_image.image.startsWith('data:')) {
          const [meta, base64] = thumbnail_image.image.split(',');
          const mime = meta.split(':')[1].split(';')[0];
          formData.append('thumbnail_image', base64ToBlob(base64, mime), thumbnail_image.name || 'thumbnail.jpg');
        }
      }

      return (await axiosInstance.put(`/api/products/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
      })).data;
    } else {
      const jsonData = { ...cleanData, category_id: cleanData.category };
      delete jsonData.category;
      if (thumbnail_image && thumbnail_image.image) {
        jsonData.thumbnail_image = thumbnail_image.image;
      }
      return (await axiosInstance.put(`/api/products/${slug}/`, jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })).data;
    }
  } catch (e) { 
    console.error('Error editing product:', e); 
    handleError(e, 'Failed to edit product'); 
  }
};

export const addProductWithoutImages = async (data) => {
  try {
    const { images, id, ...productData } = data;
    const cleanData = cleanProductData(productData);
    return (await axiosInstance.post('/api/products/', cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })).data;
  } catch (e) { handleError(e, 'Failed to add product'); }
};

export const uploadProductImages = async (productId, images) => {
  try {
    const formData = new FormData();
    images.forEach(img => img.file && formData.append('images', img.file));
    return (await axiosInstance.post(`/api/products/${productId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
    })).data;
  } catch (e) { handleError(e, 'Failed to upload images'); }
};