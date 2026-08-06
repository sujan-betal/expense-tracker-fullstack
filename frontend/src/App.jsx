import { useState } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { RiDashboardLine, RiMoneyDollarCircleLine, RiPieChartLine, RiPriceTagLine, RiLogoutBoxLine, RiCloseLine } from 'react-icons/ri'
import Dashboard from './components/Dashboard'
import Expenses from './components/Expenses'
import Analytics from './components/Analytics'
import Categories from './components/Categories'
import AuthPage from './components/AuthPage'

const NAV = [
  { to: '/', label: 'Dashboard', icon: RiDashboardLine },
  { to: '/expenses', label: 'Expenses', icon: RiMoneyDollarCircleLine },
  { to: '/analytics', label: 'Analytics', icon: RiPieChartLine },
  { to: '/categories', label: 'Categories', icon: RiPriceTagLine },
]

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [confirmOut, setConfirmOut] = useState(false)

  let user = null
  try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }

  const initials = (user?.name || user?.email || 'SW')
    .split(/[\s@]+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'SW'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setConfirmOut(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1><span className="logo-mark">₹</span> Spend<span>Wise</span></h1>
          <div className="logo-tag">Track every rupee</div>
        </div>
        <ul className="sidebar-nav">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => isActive && (to === '/' ? location.pathname === '/' : true) ? 'active' : ''}
                end={to === '/'}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-foot">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'My Account'}</div>
              <div className="user-email">{user?.email || 'Signed in'}</div>
            </div>
            <button className="logout-btn" onClick={() => setConfirmOut(true)} title="Sign out" aria-label="Sign out">
              <RiLogoutBoxLine size={17} />
            </button>
          </div>
        </div>
      </aside>

      {confirmOut && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirmOut(false)}>
          <div className="modal modal--sm" role="dialog" aria-modal="true" aria-labelledby="signout-title">
            <button className="modal-close" onClick={() => setConfirmOut(false)} aria-label="Close"><RiCloseLine size={18} /></button>
            <div className="confirm-icon">🚪</div>
            <h3 className="confirm-title" id="signout-title">Sign out?</h3>
            <p className="confirm-text">
              Are you sure you want to sign out? You'll need to sign back in to view your expenses.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmOut(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}