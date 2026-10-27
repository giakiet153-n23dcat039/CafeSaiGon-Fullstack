// ===== THÔNG TIN CỬA HÀNG (sửa ở đây là cập nhật toàn bộ website) =====
export const SHOP = {
  name: 'Cà Phê Sài Gòn',
  owner: 'Nguyễn Gia Kiệt',
  phone: '0977594929',
  address: '97 Man Thiện, phường Tăng Nhơn Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
  openHours: '6:30 - 22:00 mỗi ngày',
  bank: {
    name: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '0977594929',
    accountHolder: 'NGUYEN GIA KIET',
  },
  depositPercent: 50, // % đặt cọc trên giá trị đơn hàng
}

export const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('97 Man Thiện, Tăng Nhơn Phú, Thủ Đức, Hồ Chí Minh')
