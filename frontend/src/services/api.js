const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5100/api';

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

  updateProfile: (data) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiCall(`/auth/users${queryParams ? `?${queryParams}` : ''}`);
  },
};

// Products API calls
export const productsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await apiCall(`/products${queryParams ? `?${queryParams}` : ''}`);
    return response;
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

  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiCall(`/orders${queryParams ? `?${queryParams}` : ''}`);
  }, // Admin only

  updateStatus: (id, status) => apiCall(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  markAsPaid: (id) => apiCall(`/orders/${id}/pay`, {
    method: 'PUT',
  }),
};

// Wishlist API calls
export const wishlistAPI = {
  get: () => apiCall('/wishlist'),

  add: (productId) => apiCall(`/wishlist/${productId}`, {
    method: 'POST',
  }),

  remove: (productId) => apiCall(`/wishlist/${productId}`, {
    method: 'DELETE',
  }),
};

// Reviews API calls
export const reviewsAPI = {
  getForProduct: (productId, page = 1) => apiCall(`/reviews/products/${productId}/reviews?page=${page}`),

  add: (productId, reviewData) => apiCall(`/reviews/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  delete: (productId, reviewId) => apiCall(`/reviews/products/${productId}/reviews/${reviewId}`, {
    method: 'DELETE',
  }),
};

// Coupons API calls
export const couponsAPI = {
  validate: (code, orderAmount) => apiCall('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderAmount }),
  }),
};


