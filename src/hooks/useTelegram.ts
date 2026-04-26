// import { useEffect, useState } from 'react'

// declare global {
//   interface Window {
//     Telegram: any
//   }
// }

// interface TelegramUser {
//   id: number
//   username?: string
//   first_name?: string
//   last_name?: string
// }

// export function useTelegram() {
//   const [ready, setReady] = useState(false)
//   const [user, setUser] = useState<TelegramUser | null>(null)

//   useEffect(() => {
//     const tg = window.Telegram?.WebApp
//     if (tg) {
//       tg.ready()
//       tg.expand()
//       setUser(tg.initDataUnsafe?.user || null)
//       setReady(true)
//     } else {
//       // Development fallback
//       setUser({ id: 123456, username: 'dev_user' })
//       setReady(true)
//     }
//   }, [])

//   const expand = () => {
//     window.Telegram?.WebApp?.expand()
//   }

//   const close = () => {
//     window.Telegram?.WebApp?.close()
//   }

//   const showAlert = (message: string) => {
//     window.Telegram?.WebApp?.showAlert(message)
//   }

//   const showConfirm = (message: string): Promise<boolean> => {
//     return new Promise((resolve) => {
//       window.Telegram?.WebApp?.showConfirm(message, (confirmed: boolean) => resolve(confirmed))
//     })
//   }

//   return { ready, user, expand, close, showAlert, showConfirm }
// }




import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram: any
  }
}

interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}

// Check if we should force demo mode based on environment variable
const forceDemoMode = import.meta.env.VITE_TELEGRAM_MODE === 'false'

// Check if running in Telegram WebApp
const isTelegramWebApp = (): boolean => {
  if (forceDemoMode) return false
  return !!(window.Telegram?.WebApp?.initDataUnsafe)
}

// Get demo user from environment variables or localStorage
const getDemoUser = (): TelegramUser => {
  const storedId = localStorage.getItem('demo_user_id')
  const storedUsername = localStorage.getItem('demo_username')
  
  return {
    id: storedId ? parseInt(storedId) : parseInt(import.meta.env.VITE_DEMO_USER_ID || '123456'),
    username: storedUsername || import.meta.env.VITE_DEMO_USERNAME || 'demo_user',
    first_name: 'Demo',
    last_name: 'User'
  }
}

export function useTelegram() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    if (isTelegramWebApp()) {
      // Running in Telegram
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      setUser(tg.initDataUnsafe?.user || null)
      setReady(true)
    } else {
      // Running locally - use demo user from env/localStorage
      console.log('Running outside Telegram - using demo mode')
      setUser(getDemoUser())
      setReady(true)
    }
  }, [])

  const expand = () => {
    if (isTelegramWebApp()) {
      window.Telegram?.WebApp?.expand()
    }
  }

  const close = () => {
    if (isTelegramWebApp()) {
      window.Telegram?.WebApp?.close()
    }
  }

  const showAlert = (message: string) => {
    if (isTelegramWebApp()) {
      window.Telegram?.WebApp?.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isTelegramWebApp()) {
        window.Telegram?.WebApp?.showConfirm(message, (confirmed: boolean) => resolve(confirmed))
      } else {
        resolve(window.confirm(message))
      }
    })
  }

  return { ready, user, expand, close, showAlert, showConfirm }
}