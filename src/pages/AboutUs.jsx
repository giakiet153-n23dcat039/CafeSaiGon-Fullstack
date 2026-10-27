import { Link } from 'react-router-dom'
import { SHOP } from '../data/shop'

function AboutUs() {
  return (
    <div className="container about">
      <h1>Giới thiệu</h1>
      <p className="lead">
        Chào bạn, cảm ơn bạn đã ghé {SHOP.name}. Ở đây, mỗi gói cà phê không chỉ là hạt rang và xay,
        mà còn là một lời chào gửi đến bạn.
      </p>

      <section className="about-block">
        <h2>Câu chuyện của quán</h2>
        <p>
          Với người Sài Gòn, cà phê là buổi sáng vội vã trước giờ đi làm, là ly sữa đá giữa trưa nắng,
          là cuộc trò chuyện kéo dài đến tối muộn. Cà phê len vào những khoảnh khắc rất đời thường,
          và chính vì vậy, nó xứng đáng được pha bằng một tấm lòng.
        </p>
        <p>
          {SHOP.name} bắt đầu từ mong muốn giản dị: được pha cho bạn một ly cà phê ngon, đúng vị,
          và được kể cho bạn nghe hạt cà phê ấy đến từ đâu. Từ vùng đất đỏ Buôn Ma Thuột đến những
          triền đồi mát lạnh ở Cầu Đất, mỗi hạt đều đi qua bàn tay của người nông dân trước khi đến
          với bạn. Quán muốn bạn biết điều đó, để mỗi lần nhấp một ngụm, bạn thấy quý ly cà phê hơn một chút.
        </p>
        <p>
          Quán nhỏ nằm ở Man Thiện, phường Tăng Nhơn Phú, Thủ Đức. Quán không lớn, nhưng luôn mở cửa
          cho người đến để nghỉ chân, nói chuyện hoặc chỉ đơn giản là tìm một ly cà phê thơm.
        </p>
      </section>

      <blockquote className="quote">
        Một ly cà phê ngon là ly cà phê được uống chậm rãi, cùng người mình quý,
        vào lúc mình thấy lòng nhẹ nhất.
      </blockquote>

      <section className="about-block">
        <h2>Điều quán trân trọng</h2>
        <div className="grid">
          <div className="card">
            <h3>Hạt cà phê rõ nguồn gốc</h3>
            <p>Quán chọn hạt từ những vùng trồng quen thuộc và nói rõ cho bạn biết hạt đến từ đâu, thuộc giống nào.</p>
          </div>
          <div className="card">
            <h3>Rang theo đơn, giao khi còn thơm</h3>
            <p>Cà phê ngon nhất khi còn mới. Vì vậy quán rang theo đơn thay vì để hàng nằm kho lâu ngày.</p>
          </div>
          <div className="card">
            <h3>Tư vấn thật lòng</h3>
            <p>Nếu loại bạn định chọn chưa hợp với cách pha hay khẩu vị của bạn, quán sẽ nói thẳng và gợi ý loại phù hợp hơn.</p>
          </div>
          <div className="card">
            <h3>Rõ ràng và minh bạch</h3>
            <p>Giá, cách đặt cọc và thông tin chuyển khoản đều được ghi rõ để bạn yên tâm khi đặt hàng.</p>
          </div>
        </div>
      </section>

      <section className="about-block">
        <h2>Bạn không cần phải là người sành cà phê</h2>
        <p>
          Nhiều người ngại hỏi vì sợ mình không rành. Quán thì nghĩ khác: chỉ cần bạn thích một ly cà phê
          ngon là đủ. Nếu chưa biết nên chọn loại nào, bạn chỉ cần nhắn cho quán ba điều:
        </p>
        <ul className="hearts">
          <li>Bạn pha bằng phin, máy hay bình pha thủ công?</li>
          <li>Bạn thích vị đậm đắng hay thanh nhẹ, thơm chua?</li>
          <li>Bạn hay uống nóng hay uống đá, có thêm sữa không?</li>
        </ul>
        <p>Từ đó quán sẽ giúp bạn chọn gói cà phê hợp nhất, như người bạn thân biết rõ gu của bạn.</p>
      </section>

      <section className="about-block">
        <h2>Lời hứa của quán</h2>
        <p>
          Quán hứa sẽ luôn trả lời bạn bằng sự chân thành. Nếu gói cà phê chưa đúng vị bạn mong đợi,
          hãy nhắn cho quán. Quán sẽ lắng nghe, cùng bạn tìm ra loại hợp hơn, vì điều quán mong nhất
          là bạn quay lại, không phải chỉ mua một lần.
        </p>
      </section>

      <section className="about-sign">
        <p>
          Cảm ơn bạn đã dành thời gian đọc đến đây. Mong một ngày không xa, quán được pha cho bạn
          ly cà phê đầu tiên.
        </p>
        <p className="signature">Nguyễn Gia Kiệt<br /><span>Chủ quán {SHOP.name}</span></p>
      </section>

      <section className="about-visit card">
        <h3>Ghé thăm hoặc nhắn cho quán</h3>
        <p>{SHOP.address}</p>
        <p>Giờ mở cửa: {SHOP.openHours}</p>
        <p>Điện thoại / Zalo: <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></p>
        <p>
          <Link to="/products" className="btn small">Xem sản phẩm</Link>{' '}
          <Link to="/contact" className="btn small btn-outline">Cách đặt hàng</Link>
        </p>
      </section>
    </div>
  )
}
export default AboutUs
