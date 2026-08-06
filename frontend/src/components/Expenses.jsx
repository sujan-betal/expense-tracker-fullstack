import { useState, useEffect, useCallback } from 'react'
import { getExpenses, deleteExpense, getCategories } from '../api/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ExpenseModal from './ExpenseModal'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine } from 'react-icons/ri'

const MONTHS = ['', 'January','February','March','April','May','June','July','August','September','October','November','December']

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | expense_obj
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const load = useCallback(async () => {
    setLoading(true)
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category_id) params.category_id = filters.category_id
    if (filters.month) params.month = filters.month
    if (filters.year) params.year = filters.year
    try {
      const { data } = await getExpenses(params)
      setExpenses(data)
    } catch {
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])
  useEffect(() => { getCategories().then(r => setCategories(r.data)).catch(() => setCategories([])) }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id)
    toast.success('Deleted')
    load()
  }

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Expenses</div>
          <div className="page-subtitle">Manage all your transactions</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <RiAddLine size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <RiSearchLine size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input search-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search expenses…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="form-select" style={{ width: 160 }} value={filters.category_id} onChange={e => setFilters(f => ({ ...f, category_id: e.target.value }))}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select className="form-select" style={{ width: 130 }} value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}>
          <option value="">All months</option>
          {MONTHS.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select className="form-select" style={{ width: 100 }} value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
          {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary bar */}
      {expenses.length > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
          marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)'
        }}>
          <span>{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</span>
          <span>Total: <strong style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>{fmt(total)}</strong></span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <h3>No expenses found</h3>
          <p style={{ fontSize: 13, marginBottom: 16 }}>Try changing filters or add a new expense</p>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}><RiAddLine /> Add Expense</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{exp.title}</div>
                    {exp.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{exp.description}</div>}
                  </td>
                  <td>
                    {exp.category ? (
                      <span className="cat-badge">
                        {exp.category.icon} {exp.category.name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Uncategorized</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {format(new Date(exp.date), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="amount">{fmt(exp.amount)}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(exp)} title="Edit">
                        <RiEditLine size={14} />
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(exp.id)} title="Delete">
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ExpenseModal
          expense={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
