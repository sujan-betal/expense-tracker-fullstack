import axios from 'axios'
import { demoCategories, demoExpenses, demoDashboard, demoCategoryBreakdown, demoMonthly } from '../data/demoData'

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
const isDemoMode = () => localStorage.getItem('demo_mode') === 'true'
const demoResponse = (data) => Promise.resolve({ data: structuredClone(data) })
const readOnlyError = () => Promise.reject(new Error('This is a read-only demo. Changes are not saved.'))

// ─── Expenses ─────────────────────────────────────────────────────────────

export const getExpenses = (params = {}) => {
  if (!isDemoMode()) return api.get('/expenses/', { params })
  let rows = [...demoExpenses]
  if (params.category_id) rows = rows.filter((item) => item.category.id === Number(params.category_id))
  if (params.month) rows = rows.filter((item) => new Date(item.date).getMonth() + 1 === Number(params.month))
  if (params.year) rows = rows.filter((item) => new Date(item.date).getFullYear() === Number(params.year))
  if (params.search) rows = rows.filter((item) => item.title.toLowerCase().includes(params.search.toLowerCase()))
  return demoResponse(rows.slice(0, params.limit || rows.length))
}
export const getExpense = (id) => isDemoMode() ? demoResponse(demoExpenses.find((item) => item.id === Number(id))) : api.get(`/expenses/${id}`)
export const createExpense = (data) => isDemoMode() ? readOnlyError() : api.post('/expenses/', data)
export const updateExpense = (id, data) => isDemoMode() ? readOnlyError() : api.put(`/expenses/${id}`, data)
export const deleteExpense = (id) => isDemoMode() ? readOnlyError() : api.delete(`/expenses/${id}`)

// ─── Categories ───────────────────────────────────────────────────────────

export const getCategories = () => {
  if (isDemoMode()) return demoResponse(demoCategories)
  if (catCache && Date.now() - catCacheAt < CAT_TTL) {
    return Promise.resolve({ data: catCache })
  }
  return api.get('/categories/').then((res) => {
    catCache = res.data
    catCacheAt = Date.now()
    return res
  })
}
export const createCategory = (data) => isDemoMode() ? readOnlyError() : (clearCategoryCache(), api.post('/categories/', data))
export const updateCategory = (id, data) => isDemoMode() ? readOnlyError() : (clearCategoryCache(), api.put(`/categories/${id}`, data))
export const deleteCategory = (id) => isDemoMode() ? readOnlyError() : (clearCategoryCache(), api.delete(`/categories/${id}`))

// ─── Analytics ────────────────────────────────────────────────────────────

export const getDashboard = () => isDemoMode() ? demoResponse(demoDashboard) : api.get('/analytics/dashboard')
export const getByCategory = (params = {}) => isDemoMode() ? demoResponse(demoCategoryBreakdown) : api.get('/analytics/by-category', { params })
export const getMonthly = (year) => isDemoMode() ? demoResponse(demoMonthly) : api.get('/analytics/monthly', { params: { year } })
