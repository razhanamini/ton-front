import { useState, useEffect } from 'react'
import { api, Bet } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'
import { Page, Card, Btn, Input, TextArea, Spinner } from '../components/UI'

export default function Admin() {
  const { showAlert, showConfirm } = useTelegram()
  const [dashboard, setDashboard] = useState<any>(null)
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [statement, setStatement] = useState('')
  const [deadline, setDeadline] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dash, allBets] = await Promise.all([
        api.getDashboard(),
        api.getAllBets(),
      ])
      setDashboard(dash)
      setBets(allBets)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBet = async () => {
    if (!statement.trim() || !deadline) {
      showAlert('Statement and deadline are required')
      return
    }
    setCreating(true)
    try {
      await api.createBet(statement.trim(), deadline)
      setStatement('')
      setDeadline('')
      await loadData()
      showAlert('Bet created!')
    } catch (err: any) {
      showAlert(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleCloseBet = async (id: number) => {
    const confirmed = await showConfirm('Close this bet? No new positions will be accepted.')
    if (!confirmed) return
    try {
      await api.closeBet(id)
      await loadData()
      showAlert('Bet closed')
    } catch (err: any) {
      showAlert(err.message)
    }
  }

  const handleResolveBet = async (id: number, result: 'yes' | 'no') => {
    const confirmed = await showConfirm(`Resolve bet as ${result.toUpperCase()}? Payouts will be processed automatically.`)
    if (!confirmed) return
    try {
      await api.resolveBet(id, result)
      await loadData()
      showAlert(`Bet resolved as ${result.toUpperCase()}. Payouts processing.`)
    } catch (err: any) {
      showAlert(err.message)
    }
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
      {/* Dashboard Stats */}
      <Card>
        <h3 style={{ marginBottom: '12px' }}>📊 Dashboard</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Admin Balance</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--gold)' }}>
              {dashboard?.wallet?.balance_ton || '0'} TON
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bets</div>
            <div>{dashboard?.bets?.open} Open / {dashboard?.bets?.closed} Closed / {dashboard?.bets?.resolved} Resolved</div>
          </div>
        </div>
      </Card>

      {/* Create Bet */}
      <Card style={{ marginTop: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>➕ Create Bet</h3>
        <TextArea
          placeholder="Bet statement..."
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          rows={3}
        />
        <Input
          type="datetime-local"
          label="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginTop: '12px' }}
        />
        <div style={{ marginTop: '16px' }}>
          <Btn fullWidth onClick={handleCreateBet} loading={creating}>
            Create Bet
          </Btn>
        </div>
      </Card>

      {/* Manage Bets */}
      <h3 style={{ margin: '24px 0 12px', fontSize: '16px' }}>Manage Bets</h3>
      {bets.map(bet => (
        <Card key={bet.id} style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>#{bet.id} • </span>
            <span style={{ fontSize: '11px', color: bet.status === 'open' ? 'var(--win)' : bet.status === 'closed' ? 'var(--gold)' : 'var(--text-muted)' }}>
              {bet.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '13px', marginBottom: '12px' }}>{bet.statement}</p>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px' }}>
            Deadlines: {new Date(bet.deadline).toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {bet.status === 'open' && (
              <Btn variant="secondary" onClick={() => handleCloseBet(bet.id)}>
                Close
              </Btn>
            )}
            {bet.status === 'closed' && (
              <>
                <Btn variant="success" onClick={() => handleResolveBet(bet.id, 'yes')}>
                  Resolve YES
                </Btn>
                <Btn variant="danger" onClick={() => handleResolveBet(bet.id, 'no')}>
                  Resolve NO
                </Btn>
              </>
            )}
          </div>
        </Card>
      ))}
    </Page>
  )
}