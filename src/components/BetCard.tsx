import React from 'react'
import { Card, Badge } from './UI'
import { Bet } from '../lib/api'

interface BetCardProps {
  bet: Bet
  onClick: () => void
}

const BetCard: React.FC<BetCardProps> = ({ bet, onClick }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  const getResultColor = () => {
    if (bet.status === 'resolved' && bet.result) {
      return bet.result === 'yes' ? 'var(--win)' : 'var(--loss)'
    }
    return 'var(--gold)'
  }

  return (
    <Card onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <Badge variant={bet.status} />
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          📅 {formatDate(bet.deadline)}
        </span>
      </div>

      <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px', lineHeight: 1.4 }}>
        {bet.statement}
      </p>

      {/* Pool bars */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: 'var(--win)' }}>YES {bet.yes_pool.toFixed(2)} TON</span>
          <span style={{ color: 'var(--loss)' }}>NO {bet.no_pool.toFixed(2)} TON</span>
        </div>
        <div style={{ display: 'flex', gap: '2px', height: '6px' }}>
          <div style={{ flex: bet.yes_pool, background: 'var(--win)', borderRadius: '3px' }} />
          <div style={{ flex: bet.no_pool, background: 'var(--loss)', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Odds chips */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{
          background: bet.odds.yes > bet.odds.no ? 'var(--gold-glow)' : 'transparent',
          padding: '4px 8px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
        }}>
          YES: {bet.odds.yes}x
        </div>
        <div style={{
          background: bet.odds.no > bet.odds.yes ? 'var(--gold-glow)' : 'transparent',
          padding: '4px 8px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
        }}>
          NO: {bet.odds.no}x
        </div>
      </div>

      {bet.status === 'resolved' && bet.result && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid var(--border)`,
          fontSize: '13px',
          color: getResultColor(),
          fontWeight: 500,
        }}>
          ✅ RESULT: {bet.result.toUpperCase()}
        </div>
      )}
    </Card>
  )
}

export default BetCard