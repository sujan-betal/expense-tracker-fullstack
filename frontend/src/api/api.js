import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Expenses ──────────────────────────────────────────────────────────────────

export const getExpenses = (params = {}) => api.get('/expenses/', { params })
export const getExpense = (id) => api.get(`/expenses/${id}`)
export const createExpense = (data) => api.post('/expenses/', data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// ─── Categories ────────────────────────────────────────────────────────────────

export const getCategories = () => api.get('/categories/')
export const createCategory = (data) => api.post('/categories/', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// ─── Analytics ─────────────────────────────────────────────────────────────────

export const getDashboard = () => api.get('/analytics/dashboard')
export const getByCategory = (params = {}) => api.get('/analytics/by-category', { params })
export const getMonthly = (year) => api.get('/analytics/monthly', { params: { year } })
