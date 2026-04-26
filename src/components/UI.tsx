import React from 'react'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

export const Btn: React.FC<BtnProps> = ({ variant = 'primary', fullWidth, loading, children, disabled, ...props }) => {
  const variants = {
    primary: { background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%)', color: '#0A0A0C' },
    secondary: { background: 'var(--bg-elevated)', color: 'var(--text)', border: `1px solid var(--border)` },
    danger: { background: 'var(--danger)', color: 'white' },
    success: { background: 'var(--win)', color: 'white' },
  }

  return (
    <button
      style={{
        ...variants[variant],
        padding: '12px 24px',
        borderRadius: 'var(--radius-pill)',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        border: variant === 'secondary' ? `1px solid var(--border)` : 'none',
        transition: 'var(--transition)',
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({ children, onClick, style }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      border: `1px solid var(--border)`,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition)',
      ...style,
    }}
    onMouseEnter={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--gold)' }}
    onMouseLeave={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--border)' }}
  >
    {children}
  </div>
)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {label && <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</label>}
    <input
      style={{
        background: 'var(--bg-input)',
        border: `1px solid var(--border-subtle)`,
        borderRadius: 'var(--radius)',
        padding: '12px',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        outline: 'none',
        transition: 'var(--transition)',
      }}
      {...props}
    />
  </div>
)

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    style={{
      background: 'var(--bg-input)',
      border: `1px solid var(--border-subtle)`,
      borderRadius: 'var(--radius)',
      padding: '12px',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
    }}
    {...props}
  />
)

export const Badge: React.FC<{ variant?: 'open' | 'closed' | 'resolved' | 'pending' | 'confirmed' | 'paid' | 'expired' }> = ({ variant }) => {
  const config = {
    open: { label: 'OPEN', color: 'var(--win)', bg: 'rgba(46, 139, 86, 0.1)' },
    closed: { label: 'CLOSED', color: 'var(--danger)', bg: 'rgba(139, 0, 0, 0.1)' },
    resolved: { label: 'RESOLVED', color: 'var(--gold)', bg: 'rgba(212, 175, 55, 0.1)' },
    pending: { label: 'PENDING', color: 'var(--gold)', bg: 'rgba(212, 175, 55, 0.1)' },
    confirmed: { label: 'CONFIRMED', color: 'var(--teal-light)', bg: 'rgba(0, 111, 155, 0.1)' },
    paid: { label: 'PAID', color: 'var(--win)', bg: 'rgba(46, 139, 86, 0.1)' },
    expired: { label: 'EXPIRED', color: 'var(--text-dim)', bg: 'rgba(74, 74, 90, 0.1)' },
  }
  const c = config[variant || 'open']
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      background: c.bg,
      color: c.color,
    }}>
      {c.label}
    </span>
  )
}

export const Spinner: React.FC = () => (
  <div style={{
    width: '20px',
    height: '20px',
    border: `2px solid var(--border)`,
    borderTopColor: 'var(--gold)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }} />
)

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    {children}
  </div>
)