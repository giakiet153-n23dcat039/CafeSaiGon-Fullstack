import { SHOP, mapsUrl } from '../data/shop'
import DepositBox from '../components/DepositBox'

function Contact() {
  return (
    <div className="container">
      <h1>Liên hệ và đặt hàng</h1>

      <div className="grid two">
        <div className="card">
          <h3>Thông tin cửa hàng</h3>
          <ul className="facts">
            <li><strong>Chủ quán:</strong> {SHOP.owner}</li>
            <li><strong>Điện thoại / Zalo:</strong> <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></li>
            <li><strong>Địa chỉ:</strong> {SHOP.address}</li>
            <li><strong>Giờ mở cửa:</strong> {SHOP.openHours}</li>
          </ul>
          <a className="btn small" href={mapsUrl} target="_blank" rel="noreferrer">Xem trên Google Maps</a>
        </div>

        <div className="card">
          <h3>Quy trình đặt hàng</h3>
          <ol>
            <li>Chọn sản phẩm và số lượng, gọi hoặc nhắn Zalo cho quán.</li>
            <li>Quán xác nhận giá, thời gian rang và giao hàng.</li>
            <li>Bạn chuyển khoản đặt cọc theo thông tin bên dưới.</li>
            <li>Gửi ảnh chuyển khoản để quán xác nhận đơn.</li>
            <li>Nhận hàng và thanh toán phần còn lại.</li>
          </ol>
        </div>
      </div>

      <DepositBox />
    </div>
  )
}
export default Contact
