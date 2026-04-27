// src/App.tsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTelegram } from './hooks/useTelegram'
import { useMe } from './hooks/useMe'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import BetDetail from './pages/BetDetail'
import MyBets from './pages/MyBets'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, ready, expand } = useTelegram()
  const { profile, isAdmin } = useMe()
  const [showWalletWarning, setShowWalletWarning] = useState(false)

  useEffect(() => {
    if (ready) expand()
  }, [ready, expand])

  useEffect(() => {
    if (profile && !profile.ton_address) {
      setShowWalletWarning(true)
      const timer = setTimeout(() => setShowWalletWarning(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [profile])

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/home') return 'home'
    if (path === '/mybets') return 'mybets'
    if (path === '/profile') return 'profile'
    if (path === '/admin') return 'admin'
    return 'home'
  }

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/home')
        break
      case 'mybets':
        navigate('/mybets')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'admin':
        navigate('/admin')
        break
    }
  }

  if (!ready || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Check if we're on a bet detail page (hide navbar)
  const isBetDetailPage = location.pathname.startsWith('/bet/')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header - only show on non-bet detail pages */}
      {!isBetDetailPage && (
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px',
          zIndex: 10,
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            BETON
          </h1>
          {user && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              @{user.username || user.id}
              {isAdmin && <span style={{ color: 'var(--gold)', marginLeft: '8px' }}>👑 Admin</span>}
            </div>
          )}
        </div>
      )}

      {/* Bet Detail Header (simpler) */}
      {isBetDetailPage && (
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 16px',
          zIndex: 10,
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold)',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* Wallet Warning Banner */}
      {showWalletWarning && !profile.ton_address && !isBetDetailPage && (
        <div style={{
          background: 'var(--gold-glow)',
          borderBottom: '1px solid var(--gold-dim)',
          padding: '12px 16px',
          fontSize: '13px',
          textAlign: 'center',
          color: 'var(--gold)',
        }}>
          ⚠️ Please set your TON wallet address in Profile to place bets
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bet/:id" element={<BetDetail />} />
          <Route path="/mybets" element={<MyBets />} />
          <Route path="/profile" element={<Profile />} />
          {isAdmin && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>

      {/* Bottom Navigation - only show on main pages */}
      {!isBetDetailPage && (
        <NavBar activeTab={getActiveTab()} onTabChange={handleTabChange} isAdmin={isAdmin} />
      )}
    </div>
  )
}

export default App