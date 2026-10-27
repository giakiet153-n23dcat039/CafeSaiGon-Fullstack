import { useState } from 'react'

// Ưu tiên ảnh thật: public/images/photos/<name>.jpg
// Nếu chưa có thì dùng ảnh minh họa: public/images/<name>.svg
function PicInner({ name, alt, className = '' }) {
  const [src, setSrc] = useState(`/images/photos/${name}.jpg`)
  const [fallback, setFallback] = useState(false)

  return (
    <img
      className={`pic ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (!fallback) {
          setFallback(true)
          setSrc(`/images/${name}.svg`)
        }
      }}
    />
  )
}

function Pic(props) {
  return <PicInner key={props.name} {...props} />
}
export default Pic
