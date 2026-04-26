const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface User {
  user_id: number
  username: string
  ton_address: string | null
}

export interface Bet {
  id: number
  statement: string
  deadline: string
  status: 'open' | 'closed' | 'resolved'
  result: 'yes' | 'no' | null
  yes_pool: number
  no_pool: number
  total_pool: number
  odds: { yes: number; no: number }
  created_at: string
}

export interface Position {
  id: number
  bet_id: number
  user_id: number
  username: string
  ton_address: string
  side: 'yes' | 'no'
  amount_ton: number
  status: 'pending_payment' | 'confirmed' | 'expired' | 'paid'
  tx_hash: string | null
  expires_at: string
  paid_out: number
  created_at: string
}

export interface PaymentInfo {
  position_id: number
  status: string
  expires_at: string
  payment: {
    to_address: string
    amount_ton: number
    comment: string
    ton_link: string
  }
  message: string
}

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${res.status}`)
    }
    return res.json()
  }

  // User endpoints
  async getMe(): Promise<User> {
    return this.request('/user/me')
  }

  async setWallet(address: string): Promise<{ ok: boolean }> {
    return this.request('/user/wallet', { method: 'POST', body: JSON.stringify({ ton_address: address }) })
  }

  async getBets(): Promise<Bet[]> {
    return this.request('/user/bets')
  }

  async getBet(id: number): Promise<Bet> {
    return this.request(`/user/bets/${id}`)
  }

  async createPosition(bet_id: number, side: 'yes' | 'no', amount_ton: number): Promise<PaymentInfo> {
    return this.request('/user/positions', {
      method: 'POST',
      body: JSON.stringify({ bet_id, side, amount_ton }),
    })
  }

  async getPositions(): Promise<Position[]> {
    return this.request('/user/positions')
  }

  async getPosition(id: number): Promise<Position> {
    return this.request(`/user/positions/${id}`)
  }

  // Admin endpoints
  async getDashboard(): Promise<any> {
    return this.request('/admin/dashboard')
  }

  async getAllBets(): Promise<Bet[]> {
    return this.request('/admin/bets')
  }

  async createBet(statement: string, deadline: string): Promise<{ id: number }> {
    return this.request('/admin/bets', { method: 'POST', body: JSON.stringify({ statement, deadline }) })
  }

  async closeBet(id: number): Promise<{ ok: boolean }> {
    return this.request(`/admin/bets/${id}/close`, { method: 'POST' })
  }

  async resolveBet(id: number, result: 'yes' | 'no'): Promise<{ ok: boolean }> {
    return this.request(`/admin/bets/${id}/resolve`, { method: 'POST', body: JSON.stringify({ result }) })
  }
}

export const api = new ApiClient()