import { regions } from '../data/coffee'
import Pic from '../components/Pic'
import { regionImg } from '../data/images'

function Regions() {
  return (
    <div className="container">
      <h1>Vùng trồng cà phê</h1>
      <p className="lead">
        Độ cao, khí hậu và thổ nhưỡng quyết định hương vị của hạt cà phê. Đây là những vùng cung cấp hạt cho quán.
      </p>

      <div className="grid">
        {regions.map((r) => (
          <article className="card" key={r.name}>
            <Pic name={regionImg[r.name]} alt={`Vùng trồng ${r.name}`} />
            <h3>{r.name}</h3>
            <ul className="facts">
              <li><strong>Giống:</strong> {r.beans}</li>
              <li><strong>Độ cao:</strong> {r.altitude}</li>
              <li><strong>Mùa thu hoạch:</strong> {r.harvest}</li>
            </ul>
            <p>{r.desc}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
export default Regions
