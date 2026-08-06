import { useEffect, useState } from 'react'
import { getDashboard, getExpenses, getByCategory } from '../api/api'
import { format } from 'date-fns'
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [catData, setCatData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const done = () => setLoading(false)
    getDashboard().then(r => setStats(r.data)).catch(() => {}).then(done)
    getExpenses({ limit: 8 }).then(r => setRecent(r.data)).catch(() => {}).then(done)
    getByCategory({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }).then(r => setCatData(r.data)).catch(() => {}).then(done)
  }, [])

  if (loading) return <div className="loader"><div className="spinner" /></div>

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">{format(new Date(), 'EEEE, d MMMM yyyy')}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{fmt(stats?.total_expenses || 0)}</div>
          <div className="stat-badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
            {stats?.expense_count} transactions
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">This Month</div>
          <div className="stat-value">{fmt(stats?.total_this_month || 0)}</div>
          <span className={`stat-badge ${stats?.monthly_change_pct >= 0 ? 'up' : 'down'}`}>
            {stats?.monthly_change_pct >= 0 ? <RiArrowUpLine /> : <RiArrowDownLine />}
            {Math.abs(stats?.monthly_change_pct || 0)}% vs last month
          </span>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Last Month</div>
          <div className="stat-value">{fmt(stats?.total_last_month || 0)}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Top Category</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{stats?.top_category || '—'}</div>
        </div>
      </div>

      <div className="chart-grid">
        {/* Recent Expenses */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Recent Transactions</div>
            <a href="/expenses" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>View all →</a>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No expenses yet</h3>
              <p style={{ fontSize: 13 }}>Add your first expense to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recent.map(exp => (
                <div key={exp.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${exp.category?.color || '#6366f1'}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {exp.category?.icon || '💰'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{exp.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {exp.category?.name || 'Uncategorized'} · {format(new Date(exp.date), 'dd MMM')}
                      </div>
                    </div>
                  </div>
                  <div className="amount">{fmt(exp.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        {catData.length > 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 18 }}>
              This Month by Category
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {catData.slice(0, 6).map(c => (
                <div key={c.category_id || 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.category_icon} {c.category_name}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {fmt(c.total)} <span style={{ color: 'var(--text-muted)' }}>({c.percentage}%)</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.percentage}%`, background: c.category_color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
