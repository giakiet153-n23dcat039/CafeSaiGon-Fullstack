import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, clearSession, getSession, saveSession } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession())
  const [loading, setLoading] = useState(() => Boolean(getSession()?.token))

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authApi.login({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    })
    if (!data?.token || !data?.user) throw new Error('API đăng nhập không trả về phiên hợp lệ.')
    saveSession(data)
    setSession(data)
    setLoading(false)
    return data.user
  }, [])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const stored = getSession()
      if (!stored?.token) {
        if (active) {
          setSession(null)
          setLoading(false)
        }
        return
      }
      if (active) setLoading(true)
      try {
        // Không coi dữ liệu localStorage là bằng chứng đăng nhập: kiểm tra JWT tại API.
        const user = await authApi.me()
        if (active && getSession()?.token === stored.token) {
          setSession({ token: stored.token, user })
        }
      } catch {
        // JWT hết hạn / API không xác thực được -> đăng xuất an toàn.
        if (active && getSession()?.token === stored.token) {
          clearSession()
          setSession(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    function onStorage(event) {
      if (event.key === 'cafeSession' || event.key === null) void restoreSession()
    }

    function onUnauthorized() {
      setSession(null)
      setLoading(false)
    }

    void restoreSession()
    window.addEventListener('storage', onStorage)
    window.addEventListener('cafe-auth-changed', onUnauthorized)
    return () => {
      active = false
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cafe-auth-changed', onUnauthorized)
    }
  }, [])

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.token && session?.user),
    loading,
    login,
    logout,
  }), [session, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider')
  return context
}
