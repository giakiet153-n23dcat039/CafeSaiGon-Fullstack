import { useState } from 'react'
import { SHOP } from '../data/shop'

function DepositBox() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.bank.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Không thể sao chép. Vui lòng chép số tài khoản thủ công.')
    }
  }

  return (
    <aside className="deposit">
      <h3>Lưu ý: sản phẩm cần đặt cọc trước</h3>
      <p>
        Tất cả sản phẩm đều được rang và pha theo đơn, vì vậy quán cần bạn đặt cọc
        {' '}<strong>{SHOP.depositPercent}%</strong> giá trị đơn hàng để xác nhận đặt hàng.
      </p>
      <dl className="bank-info">
        <div><dt>Ngân hàng</dt><dd>{SHOP.bank.name}</dd></div>
        <div>
          <dt>Số tài khoản</dt>
          <dd>
            <strong>{SHOP.bank.accountNumber}</strong>
            <button type="button" className="copy-btn" onClick={copy}>
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </dd>
        </div>
        <div><dt>Chủ tài khoản</dt><dd>{SHOP.bank.accountHolder}</dd></div>
        <div><dt>Nội dung chuyển khoản</dt><dd>Họ tên - Số điện thoại - Tên sản phẩm</dd></div>
      </dl>
      <p className="note">
        Sau khi chuyển khoản, vui lòng gọi hoặc nhắn Zalo số {SHOP.phone} kèm ảnh chuyển khoản để quán xác nhận đơn.
      </p>
    </aside>
  )
}
export default DepositBox
