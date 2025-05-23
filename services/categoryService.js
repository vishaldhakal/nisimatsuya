import axiosInstance from '../lib/axiosInstance';

export const addCategory = async (data) => {
  const res = await axiosInstance.post('/api/categories/', data);
  return res.data;
};

export const editCategory = async (id, data) => {
  const res = await axiosInstance.put(`/api/categories/${id}/`, data);
  return res.data;
};

export const fetchCategory = async (id) => {
  const res = await axiosInstance.get(`/api/categories/${id}/`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axiosInstance.get('/api/categories/');
  return res.data;
};