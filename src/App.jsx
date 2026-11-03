import { useEffect } from 'react'
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Products from './pages/Products'
import CoffeeTypes from './pages/CoffeeTypes'
import Regions from './pages/Regions'
import Recipes from './pages/Recipes'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminProducts from './pages/AdminProducts'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import OrdersDashboard from './pages/OrdersDashboard'
import NewOrder from './pages/NewOrder'
import { useAuth } from './context/AuthContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const role = loading ? null : user?.role

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return <>
    <ScrollToTop />
    <Header />
    <nav aria-label="Tài khoản" style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', padding: '9px 5%', background: '#f5eee4', flexWrap: 'wrap' }}>
      {!role && !loading && <Link to="/login">Đăng nhập / Đăng ký</Link>}
      {role === 'Customer' && <><Link to="/my-orders">Đơn hàng</Link><Link to="/order/new">Đặt hàng</Link></>}
      {role === 'Staff' && <Link to="/staff/orders">Phiếu nhân viên</Link>}
      {role === 'Admin' && <><Link to="/admin/dashboard">Quản trị</Link><Link to="/admin/products">Sản phẩm</Link></>}
      {role && <><span>{user.fullName} ({role})</span><button type="button" style={{ border: 0, background: 'transparent', cursor: 'pointer' }} onClick={handleLogout}>Đăng xuất</button></>}
    </nav>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin/products" element={<RequireAuth roles={['Admin']}><AdminProducts /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin/dashboard" element={<RequireAuth roles={['Admin']}><OrdersDashboard area="admin" /></RequireAuth>} />
        <Route path="/staff/orders" element={<RequireAuth roles={['Staff']}><OrdersDashboard area="staff" /></RequireAuth>} />
        <Route path="/my-orders" element={<RequireAuth roles={['Customer']}><OrdersDashboard area="customer" /></RequireAuth>} />
        <Route path="/order/new" element={<RequireAuth roles={['Customer']}><NewOrder /></RequireAuth>} />
        <Route path="/coffee-types" element={<CoffeeTypes />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
}
