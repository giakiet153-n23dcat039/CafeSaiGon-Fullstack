import { NavLink, Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo"><img src="/images/photos/robusta-bmt.jpg" className="logo-photo" alt="" /> Cà Phê Sài Gòn</Link>
      <nav>
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/about-us">Giới thiệu</NavLink>
        <NavLink to="/products">Sản phẩm</NavLink>
        <NavLink to="/coffee-types">Các loại cà phê</NavLink>
        <NavLink to="/regions">Vùng trồng</NavLink>
        <NavLink to="/recipes">Công thức</NavLink>
        <NavLink to="/contact">Liên hệ</NavLink>
      </nav>
    </header>
  )
}
export default Header
