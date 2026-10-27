import { useState } from 'react'
import DepositBox from '../components/DepositBox'
import { SHOP } from '../data/shop'
import Pic from '../components/Pic'
import { productImg } from '../data/images'
import { useProducts } from '../hooks/useProducts'
import { Link } from 'react-router-dom'
import { getSession } from '../services/authApi'

const vnd = (n) => Number(n).toLocaleString('vi-VN') + 'đ'

function Products() {
  const [active, setActive] = useState('Tất cả')
  const { products, loading, error, reload } = useProducts()
  const categories = ['Tất cả', ...new Set(products.map((p) => p.category))]
  const list = active === 'Tất cả' ? products : products.filter((p) => p.category === active)

  return (
    <div className="container">
      <h1>Sản phẩm</h1>
      <p className="lead">Chọn loại cà phê hợp với khẩu vị và cách pha của bạn. Giá bên dưới là giá tham khảo.</p>
      <DepositBox />
      {loading && <p role="status">Đang tải sản phẩm từ API...</p>}
      {error && <div className="api-alert" role="alert">{error} <button className="btn small" onClick={reload}>Thử lại</button></div>}
      {!loading && !error && (
        <>
          <div className="tabs">
            {categories.map((c) => (
              <button key={c} className={c === active ? 'tab active' : 'tab'} onClick={() => setActive(c)}>{c}</button>
            ))}
          </div>
          {list.length === 0 && <p>Không có sản phẩm nào trong danh mục này.</p>}
          <div className="grid">
            {list.map((p) => (
              <article className="card product" key={p.id}>
                <Pic name={p.imageName || productImg[p.id] || 'blend-sai-gon'} alt={p.name} className="pic-square" />
                <h3>{p.name}</h3>
                <p className="badges"><span>{p.weight}</span><span>{p.roast}</span></p>
                <p>{p.desc}</p>
                <p><strong>Hương vị:</strong> {p.flavor}</p>
                <p><strong>Phù hợp:</strong> {p.bestFor}</p>
                <p className="price">{vnd(p.price)} <span>/ {p.weight}</span></p>
                <p className="deposit-line">Đặt cọc {SHOP.depositPercent}%: <strong>{vnd(p.price * SHOP.depositPercent / 100)}</strong></p>
                {getSession()?.user?.role === 'Customer' ? <Link className="btn small" to="/order/new">Đặt phiếu hàng</Link> : <a className="btn small" href={`tel:${SHOP.phone}`}>Gọi đặt hàng</a>}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
export default Products
