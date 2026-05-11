import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/api'
import toast from 'react-hot-toast'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri'

const PRESET_COLORS = ['#7c6af7','#22d3a0','#f43f5e','#fb923c','#fbbf24','#3b82f6','#ec4899','#10b981','#14b8a6','#8b5cf6','#06b6d4','#94a3b8']
const PRESET_ICONS = ['💰','🍽️','🚗','🎮','🏥','🛍️','💡','📚','✈️','🏠','☕','🎵','🏋️','💼','🎁','📱','🌐','🔧']

function CategoryModal({ cat, onClose, onSaved }) {
  const [form, setForm] = useState({ name: cat?.name || '', icon: cat?.icon || '💰', color: cat?.color || '#7c6af7' })
  const [saving, setSaving] = useState(false)
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value }))

  const submit = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      cat ? await updateCategory(cat.id, form) : await createCategory(form)
      toast.success(cat ? 'Category updated' : 'Category created')
      onSaved()
    } catch { toast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{cat ? 'Edit Category' : 'New Category'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><RiCloseLine size={18} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `${form.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: `2px solid ${form.color}40` }}>
            {form.icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{form.name || 'Preview'}</div>
            <div style={{ fontSize: 12, color: form.color, marginTop: 2 }}>{form.color}</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="e.g. Food & Dining" value={form.name} onChange={set('name')} />
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {PRESET_ICONS.map(ic => (
              <button key={ic} onClick={() => set('icon')(ic)}
                style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? 'var(--accent)' : 'var(--border)'}`, background: form.icon === ic ? 'var(--accent-glow)' : 'var(--bg-elevated)', cursor: 'pointer', fontSize: 18 }}>
                {ic}
              </button>
            ))}
          </div>
          <input className="form-input" placeholder="Or type any emoji…" value={form.icon} onChange={set('icon')} style={{ width: '100%' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => set('color')(c)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? 'white' : 'transparent'}`, cursor: 'pointer', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
            ))}
          </div>
          <input className="form-input" type="color" value={form.color} onChange={set('color')} style={{ height: 40, padding: '4px 8px', cursor: 'pointer' }} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : cat ? 'Save Changes' : 'Create Category'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Categories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => {
    setLoading(true)
    getCategories().then(r => setCats(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Expenses using it will become uncategorized.')) return
    await deleteCategory(id)
    toast.success('Category deleted')
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Categories</div>
          <div className="page-subtitle">Organize your spending</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <RiAddLine size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : cats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏷️</div>
          <h3>No categories yet</h3>
          <p style={{ fontSize: 13, marginBottom: 16 }}>Create categories to organize your expenses</p>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}><RiAddLine /> New Category</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {cats.map(cat => (
            <div key={cat.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = cat.color + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: `1px solid ${cat.color}30` }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.color}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(cat)} title="Edit"><RiEditLine size={14} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(cat.id)} title="Delete"><RiDeleteBinLine size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <CategoryModal
          cat={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
