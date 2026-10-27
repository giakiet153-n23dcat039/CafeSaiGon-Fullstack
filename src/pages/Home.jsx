import { Link } from 'react-router-dom'
import { SHOP } from '../data/shop'
import Pic from '../components/Pic'
import { productImg } from '../data/images'
import { useProducts } from '../hooks/useProducts'

function Home() {
  const { products, loading, error, reload } = useProducts()
  return (
    <>
      <section className="hero">
        <h1>Chào mừng đến với {SHOP.name}</h1>
        <p>Hương vị đậm đà, không gian ấm cúng. Cà phê nguyên chất từ Tây Nguyên và Đà Lạt.</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-outline">Xem sản phẩm</Link>
          <Link to="/recipes" className="btn btn-outline">Công thức pha chế</Link>
        </div>
      </section>
      <section className="features">
        <div className="card">
          <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80" alt="Hạt cà phê nguyên chất" loading="lazy" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",borderRadius:12}} />
          <h3 className="sr-only">Cà phê nguyên chất</h3>
          <p>Hạt cà phê chọn lọc từ Buôn Ma Thuột và Cầu Đất, không pha tạp, không hương liệu.</p>
        </div>
        <div className="card">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80" alt="Hạt cà phê vừa rang" loading="lazy" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",borderRadius:12}} />
          <h3 className="sr-only">Rang theo đơn</h3>
          <p>Mỗi đơn hàng được rang và đóng gói mới để giữ hương thơm trọn vẹn.</p>
        </div>
        <div className="card">
          <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80" alt="Cành cà phê với quả chín" loading="lazy" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",borderRadius:12}} />
          <h3 className="sr-only">Hiểu cà phê hơn</h3>
          <p>Tìm hiểu các giống cà phê, vùng trồng và cách pha để chọn đúng vị bạn thích.</p>
        </div>
      </section>
      <section className="section">
        <h2>Sản phẩm nổi bật</h2>
        {loading && <p role="status" className="center">Đang tải sản phẩm...</p>}
        {error && <div className="api-alert" role="alert">{error} <button className="btn small" onClick={reload}>Thử lại</button></div>}
        {!loading && !error && (
          <div className="grid">
            {products.slice(0, 3).map((p) => (
              <div className="card product" key={p.id}>
                <Pic name={p.imageName || productImg[p.id] || 'blend-sai-gon'} alt={p.name} className="pic-square" />
                <h3>{p.name}</h3>
                <p className="muted">{p.flavor}</p>
                <p className="price">{Number(p.price).toLocaleString('vi-VN')}đ <span>/ {p.weight}</span></p>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && products.length === 0 && <p className="center">Chưa có sản phẩm.</p>}
        <p className="center"><Link to="/products" className="btn">Xem tất cả sản phẩm</Link></p>
      </section>
      <section className="cta">
        <h2>Đặt hàng ngay hôm nay</h2>
        <p>Gọi hoặc nhắn Zalo <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a> để được tư vấn chọn loại cà phê phù hợp.</p>
        <Link to="/contact" className="btn">Cách đặt hàng và đặt cọc</Link>
      </section>
    </>
  )
}
export default Home
