import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { apiError } from '../services/productApi'
import '../styles/auth-orders.css'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [applyAsStaff, setApplyAsStaff] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (mode === 'register') {
        const result = await authApi.register({ email, password, fullName, applyAsStaff })
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
          state: { justSent: true, message: result.message }
        })
      } else {
        const result = await authApi.login({ email, password })
        navigate(result.user.role === 'Admin' ? '/admin/dashboard'
          : result.user.role === 'Staff' ? '/staff/orders' : '/my-orders')
      }
    } catch (error) {
      if (mode === 'login' && error.response?.status === 403 &&
          error.response?.data?.message?.includes('xác thực email')) {
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`)
      } else {
        setMessage(apiError(error))
      }
    } finally {
      setBusy(false)
    }
  }

  return <section className="auth-wrap">
    <h1>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h1>
    <p className="otp-helper">{mode === 'register'
      ? 'Sau khi đăng ký, chúng tôi gửi mã xác thực 6 số tới email của bạn.'
      : 'Đăng nhập để quản lý tài khoản và đơn hàng.'}</p>
    <form onSubmit={submit}>
      {mode === 'register' && <label>Họ tên
        <input required maxLength={120} value={fullName} onChange={e => setFullName(e.target.value)} />
      </label>}
      <label>Email
        <input required autoComplete="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>Mật khẩu
        <input required type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      {mode === 'register' && <label className="checkbox-row">
        <input type="checkbox" checked={applyAsStaff} onChange={e => setApplyAsStaff(e.target.checked)} />
        Đăng ký làm nhân viên (cần Admin duyệt)
      </label>}
      <button className="btn" disabled={busy} type="submit">
        {busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký & nhận mã email'}
      </button>
    </form>
    {message && <p role="alert" className="otp-message">{message}</p>}
    <p><button className="text-button" type="button" onClick={() => {
      setMode(mode === 'login' ? 'register' : 'login')
      setMessage('')
    }}>{mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></p>
    <p><Link to={`/verify-email?email=${encodeURIComponent(email.trim())}`}>Đã có mã? Nhập mã hoặc gửi lại mã</Link></p>
  </section>
}
