import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  }
)

// ─── Categories cache ─────────────────────────────────────────────────────
let catCache = null
let catCacheAt = 0
const CAT_TTL = 30000

const clearCategoryCache = () => { catCache = null; catCacheAt = 0 }

// ─── Expenses ─────────────────────────────────────────────────────────────

export const getExpenses = (params = {}) => api.get('/expenses/', { params })
export const getExpense = (id) => api.get(`/expenses/${id}`)
export const createExpense = (data) => api.post('/expenses/', data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// ─── Categories ───────────────────────────────────────────────────────────

export const getCategories = () => {
  if (catCache && Date.now() - catCacheAt < CAT_TTL) {
    return Promise.resolve({ data: catCache })
  }
  return api.get('/categories/').then((res) => {
    catCache = res.data
    catCacheAt = Date.now()
    return res
  })
}
export const createCategory = (data) => { clearCategoryCache(); return api.post('/categories/', data) }
export const updateCategory = (id, data) => { clearCategoryCache(); return api.put(`/categories/${id}`, data) }
export const deleteCategory = (id) => { clearCategoryCache(); return api.delete(`/categories/${id}`) }

// ─── Analytics ────────────────────────────────────────────────────────────

export const getDashboard = () => api.get('/analytics/dashboard')
export const getByCategory = (params = {}) => api.get('/analytics/by-category', { params })
export const getMonthly = (year) => api.get('/analytics/monthly', { params: { year } })
