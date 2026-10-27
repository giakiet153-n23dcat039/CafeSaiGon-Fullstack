import { coffeeTypes } from '../data/coffee'
import Pic from '../components/Pic'
import { typeImg } from '../data/images'

function CoffeeTypes() {
  return (
    <div className="container">
      <h1>Các loại cà phê</h1>
      <p className="lead">
        Mỗi giống cà phê có hương vị, hàm lượng caffeine và cách thưởng thức riêng. Hiểu về chúng sẽ giúp bạn chọn đúng loại.
      </p>

      <div className="grid">
        {coffeeTypes.map((c) => (
          <article className="card" key={c.name}>
            <Pic name={typeImg[c.name]} alt={`Hạt cà phê ${c.name}`} />
            <h3>{c.name}</h3>
            <p className="tag">{c.tag}</p>
            <p>{c.desc}</p>
            <ul className="facts">
              <li><strong>Hương vị:</strong> {c.flavor}</li>
              <li><strong>Caffeine:</strong> {c.caffeine}</li>
              <li><strong>Độ cao trồng:</strong> {c.altitude}</li>
            </ul>
          </article>
        ))}
      </div>

      <h2>So sánh nhanh Robusta và Arabica</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tiêu chí</th><th>Robusta</th><th>Arabica</th></tr>
          </thead>
          <tbody>
            <tr><td>Vị</td><td>Đắng đậm</td><td>Chua thanh, thơm</td></tr>
            <tr><td>Caffeine</td><td>Cao</td><td>Thấp hơn</td></tr>
            <tr><td>Hình dạng hạt</td><td>Nhỏ, tròn</td><td>Dài, hơi dẹt</td></tr>
            <tr><td>Nơi trồng</td><td>Vùng thấp, nóng (Tây Nguyên)</td><td>Vùng cao, mát (Đà Lạt)</td></tr>
            <tr><td>Cách pha hợp</td><td>Phin, sữa đá</td><td>Pour over, uống nóng</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default CoffeeTypes
