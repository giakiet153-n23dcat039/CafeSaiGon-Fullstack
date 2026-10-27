import axios from 'axios'

// Nếu API chạy cổng khác, đặt VITE_API_URL trong file .env ở thư mục gốc.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

export const productApi = {
  getAll: async () => (await api.get('/products')).data,
  getById: async (id) => (await api.get(`/products/${id}`)).data,
  create: async (data) => (await api.post('/products', data)).data,
  update: async (id, data) => (await api.put(`/products/${id}`, data)).data,
  remove: async (id) => api.delete(`/products/${id}`),
}

export function apiError(error) {
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(' ')
  }
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.status === 404) return 'Không tìm thấy sản phẩm.'
  if (error.response?.status) return `API trả về lỗi HTTP ${error.response.status}.`
  return 'Không kết nối được Back-end. Kiểm tra ASP.NET Core API đang chạy tại localhost:5000.'
}
