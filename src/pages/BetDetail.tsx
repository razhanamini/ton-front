import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, Bet, PaymentInfo } from '../lib/api'
import { useMe } from '../hooks/useMe'
import { useTelegram } from '../hooks/useTelegram'
import { Page, Btn, Card, Input, Spinner } from '../components/UI'

export default function BetDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useMe()
  const { showAlert } = useTelegram()
  const [bet, setBet] = useState<Bet | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null)
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [positionStatus, setPositionStatus] = useState<any>(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getBet(parseInt(id))
      .then(setBet)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    let interval: number
    if (polling && paymentInfo) {
      interval = setInterval(async () => {
        try {
          const pos = await api.getPosition(paymentInfo.position_id)
          setPositionStatus(pos)
          if (pos.status === 'confirmed') {
            setPolling(false)
            showAlert('✅ Payment confirmed! Your position is active.')
            setTimeout(() => navigate('/mybets'), 2000)
          } else if (pos.status === 'expired') {
            setPolling(false)
            showAlert('⏰ Payment window expired. Please try again.')
            setPaymentInfo(null)
          }
        } catch (e) {
          console.error(e)
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [polling, paymentInfo, navigate, showAlert])

  const handlePlaceBet = async () => {
    if (!profile?.ton_address) {
      showAlert('Please set your TON wallet address in Profile first')
      navigate('/profile')
      return
    }
    if (!selectedSide) {
      showAlert('Select Yes or No')
      return
    }
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 0.1) {
      showAlert('Minimum bet is 0.1 TON')
      return
    }

    setSubmitting(true)
    try {
      const payment = await api.createPosition(parseInt(id!), selectedSide, amountNum)
      setPaymentInfo(payment)
      setPolling(true)
      showAlert(`Send ${payment.payment.amount_ton} TON to:\n${payment.payment.to_address}\n\nComment: ${payment.payment.comment}`)
    } catch (err: any) {
      showAlert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Page>
        <div style={{ textAlign: 'center', padding: '40px' }}><Spinner /></div>
      </Page>
    )
  }

  if (!bet) {
    return (
      <Page>
        <div style={{ textAlign: 'center', padding: '40px' }}>Bet not found</div>
      </Page>
    )
  }

  if (paymentInfo) {
    return (
      <Page>
        <Card>
          <h3 style={{ marginBottom: '16px' }}>💰 Payment Required</h3>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Send exactly:</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--gold)' }}>{paymentInfo.payment.amount_ton} TON</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>To address:</p>
            <p style={{ fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace' }}>{paymentInfo.payment.to_address}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>With comment:</p>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', background: 'var(--bg)', padding: '6px', borderRadius: 'var(--radius)' }}>{paymentInfo.payment.comment}</p>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
            ⏰ Expires: {new Date(paymentInfo.expires_at).toLocaleTimeString()}
          </p>
          <div style={{ marginTop: '16px' }}>
            <Btn fullWidth onClick={() => window.open(paymentInfo.payment.ton_link, '_blank')}>
              Open in Wallet
            </Btn>
          </div>
          {positionStatus?.status === 'confirmed' && (
            <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--win)' }}>
              ✅ Confirmed!
            </div>
          )}
        </Card>
      </Page>
    )
  }

  return (
    <Page>
      <Card>
        <p style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px', lineHeight: 1.3 }}>
          {bet.statement}
        </p>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Yes Pool: {bet.yes_pool.toFixed(2)} TON</span>
            <span>No Pool: {bet.no_pool.toFixed(2)} TON</span>
          </div>
          <div>Odds: Yes {bet.odds.yes.toFixed(2)}x / No {bet.odds.no.toFixed(2)}x</div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <Btn
            variant={selectedSide === 'yes' ? 'success' : 'secondary'}
            fullWidth
            onClick={() => setSelectedSide('yes')}
          >
            ✅ YES
          </Btn>
          <Btn
            variant={selectedSide === 'no' ? 'danger' : 'secondary'}
            fullWidth
            onClick={() => setSelectedSide('no')}
          >
            ❌ NO
          </Btn>
        </div>

        <Input
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Amount in TON (min 0.1)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div style={{ marginTop: '24px' }}>
          <Btn fullWidth onClick={handlePlaceBet} loading={submitting} disabled={!selectedSide || !amount}>
            Place Bet
          </Btn>
        </div>
      </Card>
    </Page>
  )
}