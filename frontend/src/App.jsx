import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { RiDashboardLine, RiMoneyDollarCircleLine, RiPieChartLine, RiPriceTagLine } from 'react-icons/ri'
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
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>💸 Spend<span>Wise</span></h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Track every rupee</div>
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
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: 0 }}
          >
            🚪 Sign out
          </button>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>SpendWise v1.0 · FastAPI + React</div>
        </div>
      </aside>

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