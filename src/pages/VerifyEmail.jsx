import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { apiError } from '../services/productApi'
import '../styles/auth-orders.css'

export default function VerifyEmail() {
  const [search] = useSearchParams()
  const location = useLocation()
  const [email, setEmail] = useState(search.get('email') || '')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(location.state?.message || '')
  const [verified, setVerified] = useState(false)
  const [busy, setBusy] = useState(false)
  const [seconds, setSeconds] = useState(location.state?.justSent ? 60 : 0)

  useEffect(() => {
    if (seconds <= 0) return undefined
    const timer = window.setTimeout(() => setSeconds(value => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  async function confirm(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const result = await authApi.verify({ email: email.trim(), code })
      setVerified(true)
      setMessage(result.message)
    } catch (error) {
      setMessage(apiError(error))
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    setBusy(true)
    setMessage('')
    try {
      const result = await authApi.resendCode({ email: email.trim() })
      setSeconds(60)
      setCode('')
      setMessage(result.message)
    } catch (error) {
      setMessage(apiError(error))
      if (error.response?.status === 429) setSeconds(60)
    } finally {
      setBusy(false)
    }
  }

  return <section className="auth-wrap">
    <h1>Xác thực email</h1>
    <p className="otp-helper">Nhập mã gồm <strong>6 chữ số</strong> gửi tới email của bạn. Mã có hiệu lực <strong>10 phút</strong> và chỉ dùng một lần.</p>
    {verified ? <div className="otp-success">
      <p role="status">{message}</p>
      <Link className="btn otp-link-button" to="/login">Đến trang đăng nhập</Link>
    </div> : <>
      <form onSubmit={confirm}>
        <label>Email nhận mã
          <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>Mã OTP 6 số
          <input type="text" className="otp-code" required inputMode="numeric" autoComplete="one-time-code"
            pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
        </label>
        <button className="btn" disabled={busy || code.length !== 6}>Xác thực tài khoản</button>
      </form>
      {message && <p role="status" className="otp-message">{message}</p>}
      <p className="otp-resend">Chưa nhận được mã? <button className="text-button"
        disabled={busy || seconds > 0 || !email.includes('@')} type="button" onClick={resend}>
        {seconds > 0 ? `Gửi lại sau ${seconds}s` : 'Gửi lại mã OTP'}</button></p>
      <p className="otp-helper">Kiểm tra cả thư mục Spam / Thư rác nếu không thấy email.</p>
    </>}
    <p><Link to="/login">Quay về đăng nhập</Link></p>
  </section>
}
