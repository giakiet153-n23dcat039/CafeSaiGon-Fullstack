import { Link } from 'react-router-dom'
import { SHOP } from '../data/shop'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>{SHOP.name}</h4>
          <p>Cà phê rang xay nguyên chất, pha theo cách người Sài Gòn.</p>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <p>{SHOP.owner}</p>
          <p>Điện thoại: <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></p>
          <p>{SHOP.address}</p>
        </div>
        <div>
          <h4>Khám phá</h4>
          <p><Link to="/products">Sản phẩm</Link></p>
          <p><Link to="/recipes">Công thức pha chế</Link></p>
          <p><Link to="/contact">Đặt hàng và đặt cọc</Link></p>
        </div>
      </div>
      <p className="copyright">© 2026 {SHOP.name}. All rights reserved.</p>
    </footer>
  )
}
export default Footer
