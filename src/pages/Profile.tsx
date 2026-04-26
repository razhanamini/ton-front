import { useState } from 'react'
import { useMe } from '../hooks/useMe'
import { api } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'
import { Page, Card, Input, Btn } from '../components/UI'

export default function Profile() {
  const { profile, refresh } = useMe()
  const { showAlert } = useTelegram()
  const [address, setAddress] = useState(profile?.ton_address || '')
  const [saving, setSaving] = useState(false)

  const handleSaveWallet = async () => {
    if (!address.trim()) {
      showAlert('Please enter a TON address')
      return
    }
    setSaving(true)
    try {
      await api.setWallet(address.trim())
      await refresh()
      showAlert('Wallet address saved!')
    } catch (err: any) {
      showAlert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <Card>
        <h3 style={{ marginBottom: '16px' }}>👤 Profile</h3>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Username</div>
          <div style={{ fontSize: '16px' }}>@{profile?.username || profile?.user_id}</div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            TON Wallet Address
          </div>
          <Input
            placeholder="EQA... or UQA..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
            Required to place bets and receive payouts. Use Tonkeeper or similar wallet.
          </p>
        </div>

        <Btn fullWidth onClick={handleSaveWallet} loading={saving}>
          Save Wallet
        </Btn>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>ℹ️ How It Works</h3>
        <ul style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>1. Set your TON wallet address above</li>
          <li>2. Select a bet and choose Yes or No</li>
          <li>3. Send TON within 10 minutes to confirm</li>
          <li>4. If you win, payout is auto-sent to your wallet</li>
          <li>5. House fee: 2% of winning pool</li>
        </ul>
      </Card>
    </Page>
  )
}