import { useState, useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import { useMe } from './hooks/useMe'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import MyBets from './pages/MyBets'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { DebugPanel } from './components/debugPanel'


type Tab = 'home' | 'mybets' | 'profile' | 'admin'


function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
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

  if (!ready || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 12, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid var(--border)`,
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

      {/* Wallet Warning Banner */}
      {showWalletWarning && !profile.ton_address && (
        <div style={{
          background: 'var(--gold-glow)',
          borderBottom: `1px solid var(--gold-dim)`,
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
        {activeTab === 'home' && <Home />}
        {activeTab === 'mybets' && <MyBets />}
        {activeTab === 'profile' && <Profile />}
        {isAdmin && activeTab === 'admin' && <Admin />}
      </div>

      {/* Bottom Navigation */}
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />

          <DebugPanel />
    </div>

    
  )
}

export default App