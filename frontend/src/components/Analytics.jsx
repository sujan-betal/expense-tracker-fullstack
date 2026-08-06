import { useState, useEffect } from 'react'
import { getByCategory, getMonthly } from '../api/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const YEARS = [2023, 2024, 2025, 2026]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        ₹{Number(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>
    </div>
  )
}

export default function Analytics() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [monthly, setMonthly] = useState([])
  const [catData, setCatData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMonthly(year),
      getByCategory({ month, year }),
    ]).then(([m, c]) => {
      setMonthly(m.data)
      setCatData(c.data)
    }).catch(() => {
      setMonthly([])
      setCatData([])
    }).finally(() => setLoading(false))
  }, [year, month])

  const barData = MONTHS_SHORT.map((name, i) => {
    const found = monthly.find(m => m.month === i + 1)
    return { name, total: found?.total || 0, count: found?.count || 0 }
  })

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">Spending insights and trends</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="form-select" style={{ width: 110 }} value={year} onChange={e => setYear(+e.target.value)}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="form-select" style={{ width: 130 }} value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTHS_SHORT.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <>
          {/* Monthly bar chart */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
              Monthly Spending — {year}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i + 1 === month ? '#6366f1' : '#e3e5f2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-grid">
            {/* Pie chart */}
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
                By Category — {MONTHS_SHORT[month - 1]}
              </div>
              {catData.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 0' }}>
                  <div className="empty-state-icon">📊</div>
                  <h3>No data</h3>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={catData} dataKey="total" nameKey="category_name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                      {catData.map((c, i) => <Cell key={i} fill={c.category_color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Amount']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8 }} />
                    <Legend
                      formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category list */}
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
                Breakdown — {MONTHS_SHORT[month - 1]} {year}
              </div>
              {catData.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 0' }}>
                  <div className="empty-state-icon">🗂️</div>
                  <h3>No expenses this month</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {catData.map(c => (
                    <div key={c.category_id || 'none'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{c.category_icon}</span>
                          <span>{c.category_name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.count} items</span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                          {fmt(c.total)}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${c.percentage}%`, background: c.category_color }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, textAlign: 'right' }}>
                        {c.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
