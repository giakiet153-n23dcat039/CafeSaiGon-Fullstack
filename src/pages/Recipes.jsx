import { recipes, drinkingStyles, tastingSteps } from '../data/coffee'
import Pic from '../components/Pic'
import { recipeImg, styleImg } from '../data/images'

function Recipes() {
  return (
    <div className="container">
      <h1>Công thức và cách thưởng thức</h1>
      <p className="lead">Những công thức dễ làm tại nhà và gợi ý để thưởng thức cà phê trọn vị hơn.</p>

      <h2>Công thức pha chế</h2>
      <div className="grid">
        {recipes.map((r) => (
          <article className="card recipe" key={r.name}>
            <Pic name={recipeImg[r.name]} alt={r.name} className="pic-square" />
            <h3>{r.name}</h3>
            <p className="badges"><span>{r.time}</span><span>{r.type}</span></p>
            <h4>Nguyên liệu</h4>
            <ul>{r.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
            <h4>Cách làm</h4>
            <ol>{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </article>
        ))}
      </div>

      <h2>Phong cách thưởng thức</h2>
      <div className="grid">
        {drinkingStyles.map((s) => (
          <article className="card" key={s.title}>
            <Pic name={styleImg[s.title]} alt={s.title} className="pic-square" />
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </article>
        ))}
      </div>

      <h2>4 bước cảm nhận cà phê</h2>
      <ol className="steps">
        {tastingSteps.map((t) => (
          <li key={t.step}><strong>{t.step}:</strong> {t.text}</li>
        ))}
      </ol>
    </div>
  )
}
export default Recipes
