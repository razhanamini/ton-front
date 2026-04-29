

// src/pages/Home.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Bet } from '../lib/api'
import { Page, Spinner } from '../components/UI'
import BetCard from '../components/BetCard'

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Home: Fetching bets...')
    api.getBets()
      .then(data => {
        console.log('Home: Bets received:', data)
        setBets(data)
        setError(null)
      })
      .catch(err => {
        console.error('Home: Error fetching bets:', err)
        setError(err.message || 'Failed to load bets')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spinner />
        </div>
      </Page>
    )
  }

  if (error) {
    return (
      <Page>
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px' }}>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'var(--gold)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </Page>
    )
  }

  const openBets = bets.filter(b => b.status === 'open')
  const otherBets = bets.filter(b => b.status !== 'open')

  return (
    <Page>
      {openBets.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          No open bets available
        </div>
      )}

      {openBets.map(bet => (
        <div key={bet.id} style={{ marginBottom: '16px' }}>
          <BetCard bet={bet} onClick={() => navigate(`/bet/${bet.id}`)} />
        </div>
      ))}

      {otherBets.length > 0 && (
        <>
          <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '24px 0 12px' }}>
            Past Bets
          </h3>
          {otherBets.map(bet => (
            <div key={bet.id} style={{ marginBottom: '16px' }}>
              <BetCard bet={bet} onClick={() => navigate(`/bet/${bet.id}`)} />
            </div>
          ))}
        </>
      )}
    </Page>
  )
}