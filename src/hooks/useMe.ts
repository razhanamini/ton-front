import { useEffect, useState } from 'react'
import { api, User } from '../lib/api'

export function useMe() {
  const [profile, setProfile] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ADMIN_ID = import.meta.env.VITE_ADMIN_ID
    api.getMe()
      .then(user => {
        setProfile(user)
        setIsAdmin(ADMIN_ID ? user.user_id === parseInt(ADMIN_ID) : false)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const refresh = () => {
    setLoading(true)
    api.getMe()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  return { profile, isAdmin, loading, refresh }
}