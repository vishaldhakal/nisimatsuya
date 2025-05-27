import axiosInstance from '../../lib/api/axiosInstance';

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

// Fetch all orders (admin) - Updated to support filters and pagination
export const fetchOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.page_size) {
      params.append('page_size', filters.page_size);
    }
    
    // Add filter parameters
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    const url = `/api/orders/${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to fetch orders');
  }
};

// Fetch user's own orders
export const fetchMyOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.date_from) {
      params.append('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params.append('date_to', filters.date_to);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.page_size) {
      params.append('page_size', filters.page_size);
    }
    
    const url = `/api/my-orders/${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to fetch your orders');
  }
};

// Fetch a single order by ID
export const fetchOrder = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/orders/${id}/`);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to fetch order');
  }
};

// Update order status (admin)
export const updateOrderStatus = async (orderNumber, status) => {
  try {
    const res = await axiosInstance.patch(`/api/orders/${orderNumber}/`, { status });
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to update order status');
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const res = await axiosInstance.post('/api/orders/', orderData);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to create order');
  }
};

// Delete an order (admin)
export const deleteOrder = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/orders/${id}/`);
    return res.data;
  } catch (e) {
    handleError(e, 'Failed to delete order');
  }
};

// Fetch orders with filtering and pagination (admin) - Keep this for backward compatibility
export const fetchOrdersWithFilters = async (filters = {}) => {
  // This now just calls the updated fetchOrders function
  return fetchOrders(filters);
};