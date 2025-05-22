import axiosInstance from '../lib/axiosInstance';

export const fetchCategories = async () => {
  const res = await axiosInstance.get('/api/categories/');
  return res.data;
};

export const addProduct = async (data) => {
  const res = await axiosInstance.post('/api/products/', data);
  return res.data;
};

export const editProduct = async (id, data) => {
  const res = await axiosInstance.put(`/api/products/${id}/`, data);
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await axiosInstance.get(`/api/products/${id}/`);
  return res.data;
};