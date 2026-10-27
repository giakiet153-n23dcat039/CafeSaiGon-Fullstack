import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
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
import {getSession,authApi} from './services/authApi'
import {Link} from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  useLocation() // refresh navigation after successful login/logout route change
  const session = getSession()
  const role = session?.user?.role
  return (
    <>
      <ScrollToTop />
      <Header />
      <nav aria-label="Tài khoản" style={{display:'flex',gap:18,justifyContent:'flex-end',padding:'9px 5%',background:'#f5eee4',flexWrap:'wrap'}}>
        {!role && <Link to="/login">Đăng nhập / Đăng ký</Link>}
        {role==='Customer' && <><Link to="/my-orders">Đơn hàng</Link><Link to="/order/new">Đặt hàng</Link></>}
        {role==='Staff' && <Link to="/staff/orders">Phiếu nhân viên</Link>}
        {role==='Admin' && <><Link to="/admin/dashboard">Quản trị</Link><Link to="/admin/products">Sản phẩm</Link></>}
        {role && <><span>{session.user.fullName} ({role})</span><button style={{border:0,background:'transparent',cursor:'pointer'}} onClick={authApi.logout}>Đăng xuất</button></>}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin/dashboard" element={<OrdersDashboard area="admin" />} />
          <Route path="/staff/orders" element={<OrdersDashboard area="staff" />} />
          <Route path="/my-orders" element={<OrdersDashboard area="customer" />} />
          <Route path="/order/new" element={<NewOrder />} />
          <Route path="/coffee-types" element={<CoffeeTypes />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
export default App
