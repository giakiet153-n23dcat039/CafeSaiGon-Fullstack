export const coffeeTypes = [
  {
    name: 'Robusta', emoji: '💪', tag: 'Đậm, mạnh, đắng',
    caffeine: '2,2 - 2,7%', altitude: '500 - 1.000m',
    desc: 'Việt Nam là một trong những nước xuất khẩu Robusta lớn nhất thế giới. Hạt nhỏ, tròn, cho nước pha đậm, ít chua, lớp crema dày và hàm lượng caffeine cao. Đây là nền tảng của cà phê phin truyền thống.',
    flavor: 'Cacao, hạt rang, gỗ, đắng đậm',
  },
  {
    name: 'Arabica', emoji: '🌺', tag: 'Thơm, chua thanh',
    caffeine: '1,2 - 1,5%', altitude: '1.000 - 1.700m',
    desc: 'Hạt dài, trồng ở vùng cao, mát, khó chăm nên giá cao hơn. Hương thơm phức tạp, vị chua thanh dễ chịu, ít đắng. Hợp pha pour over hoặc uống nguyên vị.',
    flavor: 'Hoa, trái cây, mật ong, caramel',
  },
  {
    name: 'Moka', emoji: '🌸', tag: 'Quý hiếm, thơm nồng',
    caffeine: '1,0 - 1,4%', altitude: 'Trên 1.200m',
    desc: 'Thuộc nhóm Arabica, đặc trưng của Đà Lạt. Cây thấp, cho ít quả, chăm sóc khó. Cà phê có mùi thơm nồng, vị chua nhẹ, hậu ngọt và kéo dài.',
    flavor: 'Hoa, socola sữa, trái cây chín',
  },
  {
    name: 'Culi', emoji: '🔴', tag: 'Đậm đặc, mạnh',
    caffeine: 'Cao hơn hạt thường', altitude: 'Tùy giống',
    desc: 'Culi (peaberry) là hạt tròn đơn, chỉ có một hạt trong quả thay vì hai. Chiếm tỷ lệ nhỏ trong mùa vụ. Khi rang, hạt chín đều và cho vị đậm, đắng gọn, mạnh.',
    flavor: 'Đắng gọn, caramel cháy, đậm đà',
  },
  {
    name: 'Excelsa (Cherry/Mít)', emoji: '🍈', tag: 'Hiếm, lạ vị',
    caffeine: '1,2 - 1,5%', altitude: '600 - 1.000m',
    desc: 'Còn gọi là cà phê Mít vì cây cao to, lá lớn. Sản lượng thấp, hay được dùng để phối trộn tạo chiều sâu cho hương vị. Có nốt trái cây và hậu hơi chua.',
    flavor: 'Trái cây chín, mít, chua nhẹ, hậu đắng',
  },
]

export const regions = [
  {
    name: 'Buôn Ma Thuột, Đắk Lắk', beans: 'Robusta', altitude: 'Khoảng 500 - 600m',
    desc: 'Được xem là thủ phủ cà phê của Việt Nam. Đất đỏ bazan màu mỡ, mùa khô rõ rệt cho hạt Robusta chất lượng cao, vị đậm, hậu ngọt.',
    harvest: 'Tháng 11 - tháng 1',
  },
  {
    name: 'Cầu Đất, Đà Lạt, Lâm Đồng', beans: 'Arabica, Moka', altitude: 'Khoảng 1.500m',
    desc: 'Khí hậu mát quanh năm, sương mù nhiều giúp quả chín chậm, tích lũy hương thơm. Đây là nơi cho Arabica và Moka nổi tiếng nhất cả nước.',
    harvest: 'Tháng 10 - tháng 12',
  },
  {
    name: 'Khe Sanh, Quảng Trị', beans: 'Arabica Catimor', altitude: 'Khoảng 500 - 600m',
    desc: 'Vùng Arabica lâu đời ở miền Trung, hạt cho vị chua nhẹ, hương thơm dịu, hậu vị sạch. Giá hợp lý hơn Arabica Đà Lạt.',
    harvest: 'Tháng 10 - tháng 12',
  },
  {
    name: 'Sơn La, Tây Bắc', beans: 'Arabica Catimor', altitude: 'Khoảng 600 - 1.000m',
    desc: 'Vùng trồng Arabica ở phía Bắc với biên độ nhiệt ngày đêm lớn. Cà phê có vị chua thanh, hương trái cây và độ ngọt rõ.',
    harvest: 'Tháng 10 - tháng 12',
  },
]

export const recipes = [
  {
    name: 'Cà phê phin truyền thống', emoji: '☕', time: '5 phút', type: 'Nóng hoặc đá',
    ingredients: ['20g cà phê xay vừa (Robusta hoặc Blend)', '100 - 120ml nước 92 - 96°C', 'Đường hoặc sữa đặc tùy khẩu vị'],
    steps: [
      'Tráng phin và ly bằng nước nóng.',
      'Cho cà phê vào phin, lắc nhẹ cho bằng mặt, nén nhẹ.',
      'Rót khoảng 20ml nước nóng, chờ 30 giây cho cà phê nở (ủ).',
      'Rót phần nước còn lại, đậy nắp, chờ nhỏ giọt khoảng 4 - 5 phút.',
      'Khuấy với sữa đặc hoặc đường. Thêm đá nếu uống lạnh.',
    ],
  },
  {
    name: 'Bạc xỉu', emoji: '🥛', time: '6 phút', type: 'Đá',
    ingredients: ['30ml cà phê phin đậm', '30g sữa đặc', '80ml sữa tươi', 'Đá viên'],
    steps: [
      'Pha cà phê phin theo cách truyền thống nhưng dùng ít nước hơn.',
      'Cho sữa đặc và sữa tươi vào ly, khuấy đều.',
      'Thêm đá, rót cà phê lên trên.',
    ],
  },
  {
    name: 'Cà phê muối', emoji: '🧂', time: '8 phút', type: 'Đá',
    ingredients: ['60ml cà phê phin đậm', '20g sữa đặc', '40ml kem tươi (whipping cream)', 'Một nhúm muối nhỏ', 'Đá viên'],
    steps: [
      'Đánh kem tươi với một nhúm muối và 10g sữa đặc đến khi mịn, hơi sánh.',
      'Cho 10g sữa đặc vào ly, thêm đá và cà phê phin.',
      'Múc kem muối phủ lên trên, không khuấy ngay để cảm nhận từng lớp vị.',
    ],
  },
  {
    name: 'Cold Brew', emoji: '🧊', time: '12 - 18 giờ ủ', type: 'Lạnh',
    ingredients: ['100g cà phê xay thô', '800ml nước lọc lạnh', 'Phễu lọc hoặc túi lọc vải'],
    steps: [
      'Cho cà phê và nước vào bình, khuấy nhẹ cho thấm đều.',
      'Đậy kín, để trong ngăn mát tủ lạnh 12 - 18 giờ.',
      'Lọc bỏ bã bằng giấy lọc hoặc vải sạch.',
      'Uống với đá, có thể thêm sữa tươi hoặc nước cam. Dùng trong 5 ngày.',
    ],
  },
  {
    name: 'Cà phê trứng', emoji: '🥚', time: '10 phút', type: 'Nóng',
    ingredients: ['2 lòng đỏ trứng gà tươi', '30g sữa đặc', '1 muỗng cà phê đường', '50ml cà phê phin đậm nóng'],
    steps: [
      'Đánh lòng đỏ trứng, đường và sữa đặc đến khi bông, mịn, màu vàng nhạt.',
      'Rót cà phê nóng vào ly (có thể ngâm ly trong nước ấm cho giữ nhiệt).',
      'Múc lớp kem trứng phủ lên trên và thưởng thức bằng muỗng.',
    ],
  },
]

export const drinkingStyles = [
  {
    title: 'Phin chậm kiểu Sài Gòn', emoji: '🪑',
    desc: 'Ngồi xuống, chờ từng giọt cà phê rơi xuống ly. Đây là nhịp sống của người Sài Gòn: uống chậm, nói chuyện, đọc báo hoặc làm việc nhẹ nhàng.',
  },
  {
    title: 'Cà phê sữa đá', emoji: '🧊',
    desc: 'Vị đắng của Robusta hòa với sữa đặc ngọt béo, thêm đá lạnh. Hợp với thời tiết nóng của miền Nam và là thức uống phổ biến nhất.',
  },
  {
    title: 'Cà phê đen nóng', emoji: '🖤',
    desc: 'Không đường, không sữa để cảm nhận trọn vẹn hương và vị của hạt. Nên chọn Arabica hoặc Moka để thấy rõ sự khác biệt.',
  },
  {
    title: 'Uống kèm bánh ngọt', emoji: '🍰',
    desc: 'Cà phê đậm hợp với bánh béo, ngọt như tiramisu, bánh flan. Cà phê chua thanh hợp với bánh bơ, bánh trái cây.',
  },
]

export const tastingSteps = [
  { step: 'Nhìn', text: 'Quan sát màu nước và lớp crema (bọt) trên mặt ly.' },
  { step: 'Ngửi', text: 'Hít nhẹ để nhận ra hương hoa, trái cây, cacao hoặc hạt rang.' },
  { step: 'Nhấp', text: 'Uống một ngụm nhỏ, để cà phê lan khắp lưỡi rồi mới nuốt.' },
  { step: 'Cảm nhận hậu vị', text: 'Chú ý vị ngọt, đắng hay chua còn lại trong miệng sau khi nuốt.' },
]
