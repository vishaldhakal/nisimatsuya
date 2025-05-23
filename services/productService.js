import axiosInstance from '../lib/axiosInstance';

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

const cleanProductData = (d) => ({
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
});

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

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get('/api/categories/');
    return res.data;
  } catch (e) { handleError(e, 'Failed to fetch categories'); }
};

export const fetchProducts = async () => (await axiosInstance.get('/api/products/')).data;

export const fetchProductById = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/products/${id}/`);
    return res.data;
  } catch (e) { handleError(e, 'Failed to fetch product'); }
};

export const addProduct = async (data) => {
  try {
    const { images, id, ...productData } = data;
    const cleanData = cleanProductData(productData);
    if (hasValidImages(images)) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([k, v]) => v != null && formData.append(k, String(v)));
      appendImagesToFormData(formData, images);
      const res = await axiosInstance.post('/api/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
      });
      return res.data;
    } else {
      const res = await axiosInstance.post('/api/products/', cleanData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return res.data;
    }
  } catch (e) { handleError(e, 'Failed to add product'); }
};

export const editProduct = async (id, data) => {
  try {
    const { images, ...productData } = data;
    const cleanData = cleanProductData(productData);
    if (hasValidImages(images)) {
      const formData = new FormData();
      Object.entries(cleanData).forEach(([k, v]) => v != null && formData.append(k, String(v)));
      appendImagesToFormData(formData, images);
      const res = await axiosInstance.put(`/api/products/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
      });
      return res.data;
    } else {
      const res = await axiosInstance.put(`/api/products/${id}/`, cleanData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return res.data;
    }
  } catch (e) { handleError(e, 'Failed to edit product'); }
};

export const fetchProduct = fetchProductById;

export const addProductWithoutImages = async (data) => {
  try {
    const { images, id, ...productData } = data;
    const cleanData = cleanProductData(productData);
    const res = await axiosInstance.post('/api/products/', cleanData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (e) { handleError(e, 'Failed to add product'); }
};

export const uploadProductImages = async (productId, images) => {
  try {
    const formData = new FormData();
    images.forEach(img => img.file && formData.append('images', img.file));
    const res = await axiosInstance.post(`/api/products/${productId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000,
    });
    return res.data;
  } catch (e) { handleError(e, 'Failed to upload images'); }
};