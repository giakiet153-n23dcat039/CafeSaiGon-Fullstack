// Kiểm thử nhanh GET / GET ID / POST / PUT / DELETE (Node.js 18+).
// Chạy: node tests/smoke.mjs (Back-end đang chạy localhost:5000)
const base = process.env.API_URL || 'http://localhost:5000/api/products'
const token = process.env.ADMIN_TOKEN || ''
let createdId = null

async function request(method, path = '', data) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { ...(data ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: data ? JSON.stringify(data) : undefined,
  })
  const raw = await response.text()
  let body
  try { body = raw ? JSON.parse(raw) : null } catch { body = raw }
  return { status: response.status, body }
}
function expect(condition, message) {
  if (!condition) throw new Error(message)
  console.log('✓', message)
}

const payload = {
  name: 'Cà phê kiểm thử tự động', category: 'Cà phê rang', emoji: '☕',
  weight: '250g', price: 90000, roast: 'Rang vừa', flavor: 'Hương kiểm thử',
  desc: 'Tạo bởi bài kiểm thử; sẽ bị xóa sau khi chạy', bestFor: 'Demo',
  imageName: 'blend-sai-gon',
}

try {
  const list = await request('GET')
  expect(list.status === 200 && Array.isArray(list.body), 'GET /api/products trả về danh sách')

  if (list.body.length > 0) {
    const one = await request('GET', `/${list.body[0].id}`)
    expect(one.status === 200 && one.body.id === list.body[0].id, 'GET /api/products/{id} trả về sản phẩm')
  }

  if (!token) { console.log('Chỉ kiểm tra GET: cung cấp ADMIN_TOKEN để kiểm thử POST/PUT/DELETE đã phân quyền.'); process.exit(0) }

  const created = await request('POST', '', payload)
  expect(created.status === 201 && created.body?.id > 0, 'POST tạo sản phẩm (201)')
  createdId = created.body.id

  const updated = await request('PUT', `/${createdId}`, { ...payload, price: 120000, name: 'Sản phẩm đã sửa' })
  expect(updated.status === 204, 'PUT cập nhật sản phẩm (204)')
  const verify = await request('GET', `/${createdId}`)
  expect(verify.status === 200 && verify.body.price === 120000, 'GET xác nhận giá mới từ database')

  const removed = await request('DELETE', `/${createdId}`)
  expect(removed.status === 204, 'DELETE xóa sản phẩm (204)')
  createdId = null
  const missing = await request('GET', `/${verify.body.id}`)
  expect(missing.status === 404, 'GET sau khi xóa trả về 404')
  console.log('\nTHÀNH CÔNG: 5 endpoint CRUD đáp ứng bài thực hành.')
} catch (error) {
  console.error('\nKIỂM THỬ THẤT BẠI:', error.message)
  process.exitCode = 1
} finally {
  if (createdId !== null) {
    try { await request('DELETE', `/${createdId}`) } catch { /* không che lỗi gốc */ }
  }
}
