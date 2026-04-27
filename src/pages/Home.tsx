// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { api, Bet } from '../lib/api'
// import { Page, Spinner } from '../components/UI'
// import BetCard from '../components/BetCard'

// export default function Home() {
//   const [bets, setBets] = useState<Bet[]>([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     api.getBets()
//       .then(setBets)
//       .catch(console.error)
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) {
//     return (
//       <Page>
//         <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
//           <Spinner />
//         </div>
//       </Page>
//     )
//   }

//   const openBets = bets.filter(b => b.status === 'open')
//   const otherBets = bets.filter(b => b.status !== 'open')

//   return (
//     <Page>
//       {openBets.length === 0 && (
//         <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
//           No open bets available
//         </div>
//       )}

//       {openBets.map(bet => (
//         <div key={bet.id} style={{ marginBottom: '16px' }}>
//           <BetCard bet={bet} onClick={() => navigate(`/bet/${bet.id}`)} />
//         </div>
//       ))}

//       {otherBets.length > 0 && (
//         <>
//           <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '24px 0 12px' }}>
//             Past Bets
//           </h3>
//           {otherBets.map(bet => (
//             <div key={bet.id} style={{ marginBottom: '16px' }}>
//               <BetCard bet={bet} onClick={() => navigate(`/bet/${bet.id}`)} />
//             </div>
//           ))}
//         </>
//       )}
//     </Page>
//   )
// }

// src/App.tsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { useMe } from '../hooks/useMe'
import NavBar from '../components/NavBar'
import Home from './Home'
import BetDetail from './BetDetail'
import MyBets from './MyBets'
import Profile from './Profile'
import Admin from './Admin'

type Tab = 'home' | 'mybets' | 'profile' | 'admin'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
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

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/') setActiveTab('home')
    else if (path === '/mybets') setActiveTab('mybets')
    else if (path === '/profile') setActiveTab('profile')
    else if (path === '/admin') setActiveTab('admin')
  }, [location])

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

      {/* Wallet Warning Banner */}
      {showWalletWarning && !profile.ton_address && (
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

      {/* Main Content with Routes */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bet/:id" element={<BetDetail />} />
          <Route path="/mybets" element={<MyBets />} />
          <Route path="/profile" element={<Profile />} />
          {isAdmin && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>

      {/* Bottom Navigation - hide on bet detail page */}
      {!location.pathname.startsWith('/bet/') && (
        <NavBar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          navigate(`/${tab === 'home' ? '' : tab}`)
        }} isAdmin={isAdmin} />
      )}
    </div>
  )
}

export default App
