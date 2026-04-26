import { useState, useEffect } from 'react'
import { api, Position, Bet } from '../lib/api'
import { Page, Card, Badge, Spinner } from '../components/UI'

type Filter = 'all' | 'active' | 'resolved'

export default function MyBets() {
  const [positions, setPositions] = useState<Position[]>([])
  const [bets, setBets] = useState<Map<number, Bet>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    Promise.all([
      api.getPositions(),
      api.getBets(),
    ])
      .then(([positionsData, betsData]) => {
        setPositions(positionsData)
        const betMap = new Map(betsData.map(b => [b.id, b]))
        setBets(betMap)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredPositions = positions.filter(pos => {
    const bet = bets.get(pos.bet_id)
    if (filter === 'active') return bet?.status !== 'resolved'
    if (filter === 'resolved') return bet?.status === 'resolved'
    return true
  })

  const getStatusBadge = (pos: Position, bet?: Bet) => {
    if (bet?.status === 'resolved') {
      const won = (bet.result === pos.side && pos.status === 'confirmed')
      return <Badge variant={won ? 'paid' : 'expired'} />
    }
    if (pos.status === 'pending_payment') return <Badge variant="pending" />
    if (pos.status === 'confirmed') return <Badge variant="confirmed" />
    if (pos.status === 'paid') return <Badge variant="paid" />
    return <Badge variant="expired" />
  }

  if (loading) {
    return (
      <Page>
        <div style={{ textAlign: 'center', padding: '40px' }}><Spinner /></div>
      </Page>
    )
  }

  return (
    <Page>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: `1px solid var(--border)`, paddingBottom: '12px' }}>
        {(['all', 'active', 'resolved'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              background: filter === f ? 'var(--gold-glow)' : 'transparent',
              border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-pill)',
              color: filter === f ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          No bets found
        </div>
      )}

      {filteredPositions.map(pos => {
        const bet = bets.get(pos.bet_id)
        const won = bet?.status === 'resolved' && bet.result === pos.side && pos.status === 'confirmed'
        
        return (
          <Card key={pos.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              {getStatusBadge(pos, bet)}
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                {new Date(pos.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
              {bet?.statement || `Bet #${pos.bet_id}`}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: pos.side === 'yes' ? 'var(--win)' : 'var(--loss)', fontWeight: 500 }}>
                  {pos.side.toUpperCase()}
                </span>
                <span style={{ marginLeft: '8px', color: 'var(--gold)' }}>
                  {pos.amount_ton} TON
                </span>
              </div>
              {won && (
                <div style={{ color: 'var(--win)', fontWeight: 500 }}>
                  +{(pos.amount_ton * (bet?.odds?.[pos.side] || 1)).toFixed(2)} TON
                </div>
              )}
            </div>
            
            {bet?.status === 'resolved' && bet.result && (
              <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: `1px solid var(--border)`,
                fontSize: '12px',
                color: bet.result === pos.side ? 'var(--win)' : 'var(--loss)',
              }}>
                Result: {bet.result.toUpperCase()} {bet.result === pos.side ? '✓ You won!' : '✗ You lost'}
              </div>
            )}
          </Card>
        )
      })}
    </Page>
  )
}