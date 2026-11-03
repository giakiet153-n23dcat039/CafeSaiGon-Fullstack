import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ roles, children }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) return <section className="section"><p>Đang kiểm tra phiên đăng nhập...</p></section>
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  if (roles?.length && !roles.includes(user.role)) {
    return <section className="section">
      <h2>Không có quyền truy cập</h2>
      <p>Tài khoản này không có quyền vào trang được yêu cầu.</p>
      <Link to="/">Về trang chủ</Link>
    </section>
  }
  return children
}
