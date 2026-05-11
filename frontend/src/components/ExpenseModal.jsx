import { useState, useEffect } from 'react'
import { createExpense, updateExpense, getCategories } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { RiCloseLine } from 'react-icons/ri'

export default function ExpenseModal({ expense, onClose, onSaved }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    description: expense?.description || '',
    category_id: expense?.category_id || '',
    date: expense?.date ? format(new Date(expense.date), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data))
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return toast.error('Enter a valid amount')
    if (!form.date) return toast.error('Date is required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        date: new Date(form.date).toISOString(),
      }
      if (expense) {
        await updateExpense(expense.id, payload)
        toast.success('Expense updated')
      } else {
        await createExpense(payload)
        toast.success('Expense added')
      }
      onSaved()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{expense ? 'Edit Expense' : 'New Expense'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><RiCloseLine size={18} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="e.g. Dinner at restaurant" value={form.title} onChange={set('title')} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={set('amount')} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category_id} onChange={set('category_id')}>
              <option value="">— None —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date & Time</label>
          <input className="form-input" type="datetime-local" value={form.date} onChange={set('date')} />
        </div>

        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-textarea" placeholder="Additional notes..." value={form.description} onChange={set('description')} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : expense ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}
