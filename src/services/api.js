const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiCall('/auth/profile'),
};

// Products API calls
export const productsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiCall(`/products${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getById: (id) => apiCall(`/products/${id}`),
  
  create: (productData) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API calls
export const ordersAPI = {
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getMyOrders: () => apiCall('/orders/myorders'),
  
  getById: (id) => apiCall(`/orders/${id}`),
  
  getAll: () => apiCall('/orders'), // Admin only
  
  updateStatus: (id, status) => apiCall(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  markAsPaid: (id) => apiCall(`/orders/${id}/pay`, {
    method: 'PUT',
  }),
};

