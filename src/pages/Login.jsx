import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/authApi'
import { apiError } from '../services/productApi'
import '../styles/auth-orders.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [applyAsStaff, setApplyAsStaff] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    const normalizedEmail = email.trim().toLowerCase()
    if (!emailPattern.test(normalizedEmail)) {
      setMessage('Email không đúng định dạng.')
      return
    }
    if (password.length < 8) {
      setMessage('Mật khẩu phải có ít nhất 8 ký tự.')
      return
    }
    if (mode === 'register' && !fullName.trim()) {
      setMessage('Vui lòng nhập họ tên.')
      return
    }
    if (mode === 'register' && password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không trùng khớp.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'register') {
        const result = await authApi.register({
          email: normalizedEmail, password, fullName: fullName.trim(), applyAsStaff,
        })
        navigate(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`, {
          state: { justSent: true, message: result.message },
        })
      } else {
        const user = await login({ email: normalizedEmail, password })
        navigate(user.role === 'Admin' ? '/admin/dashboard'
          : user.role === 'Staff' ? '/staff/orders' : '/my-orders', { replace: true })
      }
    } catch (error) {
      if (mode === 'login' && error.response?.status === 403 &&
          error.response?.data?.message?.includes('xác thực email')) {
        navigate(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`)
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
        <input required maxLength={120} autoComplete="name" value={fullName}
          onChange={(event) => setFullName(event.target.value)} />
      </label>}
      <label>Email
        <input required type="email" autoComplete="email" maxLength={255} value={email}
          onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>Mật khẩu
        <input required type="password" minLength={8}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {mode === 'register' && <label>Nhập lại mật khẩu
        <input required type="password" minLength={8} autoComplete="new-password"
          value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
      </label>}
      {mode === 'register' && <label className="checkbox-row">
        <input type="checkbox" checked={applyAsStaff} onChange={(event) => setApplyAsStaff(event.target.checked)} />
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
      setConfirmPassword('')
    }}>{mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></p>
    <p><Link to={`/verify-email?email=${encodeURIComponent(email.trim())}`}>Đã có mã? Nhập mã hoặc gửi lại mã</Link></p>
  </section>
}
