import { useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'

export function DebugPanel() {
  const [showDebug, setShowDebug] = useState(false)
  const { user } = useTelegram()
  const isDev = import.meta.env.DEV && import.meta.env.VITE_TELEGRAM_MODE === 'false'

  if (!isDev) return null

  const switchUser = (id: number, username: string) => {
    localStorage.setItem('demo_user_id', id.toString())
    localStorage.setItem('demo_username', username)
    window.location.reload()
  }

  const resetUser = () => {
    localStorage.removeItem('demo_user_id')
    localStorage.removeItem('demo_username')
    window.location.reload()
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 10,
      zIndex: 1000,
    }}>
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--gold)',
          borderRadius: 'var(--radius-pill)',
          padding: '8px 12px',
          fontSize: '11px',
          color: 'var(--gold)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        🐛 Debug
      </button>
      
      {showDebug && (
        <div style={{
          position: 'absolute',
          bottom: 45,
          right: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '12px',
          minWidth: '180px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            Current: @{user?.username} ({user?.id})
          </div>
          <button 
            onClick={() => switchUser(123456, 'admin')} 
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: '4px',
              padding: '6px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            👑 Admin User
          </button>
          <button 
            onClick={() => switchUser(789012, 'player1')} 
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: '4px',
              padding: '6px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            🎮 Player 1
          </button>
          <button 
            onClick={() => switchUser(345678, 'player2')} 
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: '8px',
              padding: '6px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            🎮 Player 2
          </button>
          <button 
            onClick={resetUser} 
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '6px',
              background: 'var(--danger)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  )
}