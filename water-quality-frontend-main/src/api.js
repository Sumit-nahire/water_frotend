import axios from 'axios';

// .env file madhun URL gheun yeil. Local sathi fallback 8081 thevla ahe.
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081';

// Axios instance banvuya (Best Practice - code clean rahil)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// Users APIs
// ==========================================
export const getAllUsers = () => api.get('/users');
export const createUser = (user) => api.post('/users', user);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ==========================================
// Complaints APIs
// ==========================================
export const getAllComplaints = () => api.get('/complaints');
export const createComplaint = (complaint) => api.post('/complaints', complaint);
export const getComplaintById = (id) => api.get(`/complaints/${id}`);
export const updateComplaint = (id, complaint) => api.put(`/complaints/${id}`, complaint);
export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);