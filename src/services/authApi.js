import { api } from './productApi'

// Giữ tên khóa cafeSession; chuyển cách lưu từ sessionStorage sang localStorage.
const SESSION_KEY = 'cafeSession'

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    return session?.token && session?.user ? session : null
  } catch {
    return null
  }
}

export function saveSession(session) {
  // Chỉ lưu JWT + thông tin user công khai. Tuyệt đối không lưu mật khẩu.
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    token: session.token,
    user: session.user,
  }))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Gắn token vào các yêu cầu API sau khi đăng nhập.
api.interceptors.request.use((config) => {
  const token = getSession()?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Khi JWT hết hạn hoặc không còn hợp lệ, đồng bộ trạng thái đăng xuất.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url || ''
    if (error.response?.status === 401 && !requestPath.includes('/auth/login') && getSession()) {
      clearSession()
      window.dispatchEvent(new Event('cafe-auth-changed'))
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  register: async (data) => (await api.post('/auth/register', data)).data,
  verify: async (data) => (await api.post('/auth/verify-email', data)).data,
  resendCode: async (data) => (await api.post('/auth/resend-code', data)).data,
  // Việc ghi localStorage và cập nhật state do AuthContext chịu trách nhiệm.
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  // Duy trì tính tương thích với các trang cũ đang gọi authApi.logout().
  logout: () => {
    clearSession()
    window.location.assign('/login')
  },
  me: async () => (await api.get('/auth/me')).data,
}

export const ordersApi = {
  list: async () => (await api.get('/orders')).data,
  create: async (data) => (await api.post('/orders', data)).data,
  approve: async (id) => (await api.put(`/orders/${id}/approve`)).data,
  status: async (id, status) => (await api.put(`/orders/${id}/status`, { status })).data,
  receipt: async (id) => {
    const response = await api.get(`/orders/${id}/receipt.txt`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `phieu-hang-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  },
  pendingStaff: async () => (await api.get('/admin/users/staff-pending')).data,
  approveStaff: async (id) => (await api.put(`/admin/users/${id}/approve`)).data,
}
