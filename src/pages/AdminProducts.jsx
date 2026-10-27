import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSession } from '../services/authApi'
import { apiError, productApi } from '../services/productApi'
import '../styles/admin.css'

const imageChoices = ['robusta-bmt', 'arabica-cau-dat', 'moka-cau-dat', 'culi', 'blend-sai-gon', 'cold-brew']
const emptyForm = {
  name: '', category: 'Cà phê rang', emoji: '☕', weight: '500g', price: '',
  roast: '', flavor: '', desc: '', bestFor: '', imageName: 'blend-sai-gon',
}
const vnd = (n) => Number(n).toLocaleString('vi-VN') + 'đ'
const inputFields = [
  ['name', 'Tên sản phẩm', 'text', true],
  ['category', 'Danh mục', 'text', true],
  ['emoji', 'Biểu tượng', 'text', false],
  ['weight', 'Khối lượng / Dung tích', 'text', true],
  ['price', 'Giá (VND)', 'number', true],
  ['roast', 'Đặc điểm rang / Chế biến', 'text', false],
  ['flavor', 'Hương vị', 'text', false],
  ['bestFor', 'Phù hợp', 'text', false],
]

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ ...emptyForm })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    try { setProducts(await productApi.getAll()) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadProducts() }, [])

  function resetForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name, category: p.category, emoji: p.emoji || '☕',
      weight: p.weight, price: String(p.price), roast: p.roast || '',
      flavor: p.flavor || '', desc: p.desc || '', bestFor: p.bestFor || '',
      imageName: p.imageName || 'blend-sai-gon',
    })
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!form.name.trim() || !form.category.trim() || !form.weight.trim() || Number(form.price) <= 0) {
      setError('Vui lòng điền tên, danh mục, khối lượng và giá lớn hơn 0.')
      return
    }
    setSaving(true)
    const body = { ...form, price: Number(form.price) }
    try {
      if (editingId === null) {
        await productApi.create(body)
        setNotice('Đã thêm sản phẩm bằng POST thành công.')
      } else {
        await productApi.update(editingId, body)
        setNotice('Đã cập nhật sản phẩm bằng PUT thành công.')
      }
      resetForm()
      await loadProducts()
    } catch (err) { setError(apiError(err)) }
    finally { setSaving(false) }
  }

  async function remove(p) {
    if (!window.confirm(`Xóa sản phẩm “${p.name}” (ID: ${p.id})?`)) return
    setError('')
    setNotice('')
    setSaving(true)
    try {
      await productApi.remove(p.id)
      if (editingId === p.id) resetForm()
      setNotice('Đã xóa sản phẩm bằng DELETE thành công.')
      await loadProducts()
    } catch (err) { setError(apiError(err)) }
    finally { setSaving(false) }
  }


  if (getSession()?.user?.role !== 'Admin') return <div className="container"><h2>Không có quyền quản lý sản phẩm</h2><p><Link to="/login">Đăng nhập bằng tài khoản Admin</Link></p></div>

  return (
    <div className="container admin-products">
      <div className="admin-title"><div><h1>Quản lý sản phẩm</h1><p className="lead">ASP.NET Core API • Axios • EF Core • SQLite</p></div><Link to="/products" className="btn small">Xem cửa hàng</Link></div>
      <p className="admin-warning">Chỉ quản trị viên được thêm, sửa và xóa sản phẩm. Các thao tác được xác thực tại Back-end.</p>
      {error && <p className="api-alert" role="alert">{error}</p>}
      {notice && <p className="api-success" role="status">{notice}</p>}
      <div className="admin-panel">
        <h2>{editingId === null ? 'Thêm cà phê mới — POST' : `Sửa sản phẩm #${editingId} — PUT`}</h2>
        <form onSubmit={submit}>
          <div className="admin-form-grid">
            {inputFields.map(([key, label, type, required]) => (
              <label key={key}>{label}
                <input value={form[key]} type={type} min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined} required={required}
                  onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))} />
              </label>
            ))}
            <label>Ảnh minh họa
              <select value={form.imageName} onChange={(event) => setForm((prev) => ({ ...prev, imageName: event.target.value }))}>
                {imageChoices.map((name) => <option value={name} key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <label className="admin-full">Mô tả sản phẩm
            <textarea rows="3" value={form.desc} onChange={(event) => setForm((prev) => ({ ...prev, desc: event.target.value }))} />
          </label>
          <div className="admin-actions">
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Đang lưu...' : editingId === null ? 'Thêm sản phẩm (POST)' : 'Lưu thay đổi (PUT)'}</button>
            {editingId !== null && <button type="button" className="admin-secondary" onClick={resetForm} disabled={saving}>Hủy sửa</button>}
          </div>
        </form>
      </div>
      <div className="admin-panel">
        <div className="admin-title"><h2>Danh sách sản phẩm — GET</h2><button className="btn small" onClick={loadProducts} disabled={loading || saving}>Tải lại (GET)</button></div>
        {loading ? <p>Đang tải từ database...</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Tên cà phê</th><th>Danh mục</th><th>Giá</th><th>Thao tác</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td><td>{p.emoji} {p.name}</td><td>{p.category}</td><td>{vnd(p.price)}</td>
                    <td><div className="admin-row-actions"><button className="admin-edit" onClick={() => startEdit(p)} disabled={saving}>Sửa</button><button className="admin-delete" onClick={() => remove(p)} disabled={saving}>Xóa</button></div></td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="5">Chưa có sản phẩm.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
export default AdminProducts
