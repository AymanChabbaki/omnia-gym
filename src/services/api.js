const API_URL = 'http://localhost:5000/api';

export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchProducts = async (category = 'all', search = '') => {
  let url = new URL(`${API_URL}/products`);
  
  if (category && category !== 'all') {
    url.searchParams.append('category', category);
  }
  if (search) {
    url.searchParams.append('search', search);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product details');
  return res.json();
};

// Order Operations
export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
};

// Admin Operations
const adminHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// Category Admin
export const createCategory = async (data, token) => {
  const res = await fetch(`${API_URL}/categories`, { method: 'POST', headers: adminHeaders(token), body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create'); return res.json();
};

export const updateCategory = async (id, data, token) => {
  const res = await fetch(`${API_URL}/categories/${id}`, { method: 'PUT', headers: adminHeaders(token), body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update'); return res.json();
};

export const deleteCategory = async (id, token) => {
  const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to delete'); return res.json();
};

// Product Admin
export const createProduct = async (data, token) => {
  const isFormData = data instanceof FormData;
  const headers = { 'Authorization': `Bearer ${token}` };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}/products`, { 
    method: 'POST', 
    headers, 
    body: isFormData ? data : JSON.stringify(data) 
  });
  if (!res.ok) throw new Error('Failed to create'); return res.json();
};

export const updateProduct = async (id, data, token) => {
  const isFormData = data instanceof FormData;
  const headers = { 'Authorization': `Bearer ${token}` };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}/products/${id}`, { 
    method: 'PUT', 
    headers, 
    body: isFormData ? data : JSON.stringify(data) 
  });
  if (!res.ok) throw new Error('Failed to update'); return res.json();
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to delete'); return res.json();
};

// Order Admin
export const fetchOrders = async (token) => {
  const res = await fetch(`${API_URL}/orders`, { headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const deleteOrder = async (id, token) => {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE', headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
};
