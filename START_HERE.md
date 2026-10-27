# CÀ PHÊ SÀI GÒN — PROJECT HOÀN CHỈNH

Đây là **toàn bộ project từ ZIP website gốc bạn gửi**, đã ghép ASP.NET Core + tài khoản + phân quyền + phiếu hàng. **Không cần tải Git hoặc chạy file BAT/PowerShell.**

## Yêu cầu máy

- Windows, VS Code, **.NET 10 SDK** và Node.js (khuyến nghị bản LTS).
- Kiểm tra trong Terminal của VS Code: `dotnet --version`, `node -v`, `npm -v`.
- ZIP **không kèm `node_modules`** vì bản cũ thiếu `vite.js`. Chạy `npm.cmd ci` một lần ở thư mục gốc (cần internet), sau đó `npm.cmd run dev`. Không cần tải lại GitHub.

## Khởi động (2 Terminal, KHÔNG chạy BAT)

**Bước 1:** Giải nén ZIP, mở chính thư mục `web-ca-phe-sai-gon` bằng VS Code (`File > Open Folder`).

**Terminal 1 — Backend** (mở terminal tại thư mục gốc của project):

```powershell
cd backend/CafeSaiGon.Api
dotnet restore
dotnet run --launch-profile http
```

- Lần chạy đầu **trong chế độ Development**, ứng dụng tạo khóa JWT ngẫu nhiên ở `%LOCALAPPDATA%\CafeSaiGonDev\jwt.key` (không nằm trong ZIP).
- Nếu cơ sở dữ liệu chưa có Admin, chương trình tự tạo **`admin@cafesaigon.com`** với **mật khẩu ngẫu nhiên** và in một lần duy nhất trong Terminal. **Ghi lại mật khẩu.** Không có mật khẩu mặc định trong source.
- Back-end tự áp dụng **EF Core migration AddAccountsOrders** trên file `backend/CafeSaiGon.Api/ca-phe-sai-gon.db` của bạn, giữ nguyên 6 sản phẩm đang có.
- API tại `http://localhost:5000/api/products`.

**Terminal 2 — Frontend** (mở một terminal khác tại thư mục gốc):

```powershell
npm.cmd ci
npm.cmd run dev -- --port 3000
```

Nếu đã chạy `npm ci` thành công trước đó, những lần sau chỉ cần `npm.cmd run dev -- --port 3000`. Mở `http://localhost:3000`.

**VS Code Tasks:** Có thể chọn `Terminal > Run Task > 1 - Chạy Backend ASP.NET Core`; sau đó mở thêm task `2 - Chạy Website React`. Dùng `npm.cmd` để tránh việc PowerShell vô tình gọi script `npm.ps1`. Hai tác vụ dùng trực tiếp `dotnet` / `npm.cmd`, không chạy script BAT tự tạo.

## Đăng nhập và vai trò

- `http://localhost:3000/login`: Đăng ký / đăng nhập.
- **Admin:** dùng email và mật khẩu ngẫu nhiên được in ở lần chạy đầu. `/admin/dashboard` duyệt nhân viên, duyệt phiếu; `/admin/products` CRUD sản phẩm.
- **Nhân viên:** đăng ký tích vào lựa chọn ứng tuyển, **xác thực email**, chờ Admin duyệt; vào `/staff/orders` và chỉ nhìn thấy phiếu được Admin duyệt.
- **Khách hàng:** đăng ký, xác thực email, tạo phiếu tại `/order/new`, xem phiếu `/my-orders`.
- **Sai mật khẩu 3 lần đối với tài khoản tồn tại**: khóa tạm 15 phút. Đây là bảo vệ theo tài khoản, **chưa bao gồm bảo vệ toàn diện theo IP**.
- Xuất phiếu `.txt` UTF-8 có chi tiết, tổng tiền, giao hàng. TXT dễ đọc và sửa chữ; để làm chứng từ chuẩn, nên bổ sung PDF thay vì JPG.

## Xác thực email bằng mã OTP 6 số (gửi email thật)

- Khi đăng ký, hệ thống gửi **mã 6 số qua SMTP** tới email vừa nhập; website chuyển sang `/verify-email` để nhập mã.
- Mã dùng một lần, hết hạn sau **10 phút**, tối đa **5 lần nhập sai**, gửi lại cách nhau ít nhất **60 giây**, tối đa **5 mã/24 giờ**.
- Mã được lưu dạng **HMAC**, không lưu OTP rõ trong SQLite hay trả OTP qua API/log.
- **BẮT BUỘC cấu hình SMTP**; nếu chưa cấu hình hoặc email gửi thất bại thì API báo lỗi thay vì giả vờ gửi thành công.
- Xem file **`HUONG_DAN_EMAIL_OTP.md`** để cài Gmail SMTP bằng `dotnet user-secrets`, không để mật khẩu trong source.
- Nhân viên sau khi xác thực email vẫn phải chờ Admin duyệt.

## Bảo vệ database đang dùng trên máy

Nếu bạn **đã có tài khoản Admin, nhân viên hay đơn hàng** ở bản Cà Phê Sài Gòn trước, hãy ưu tiên ZIP **bản vá OTP** (`CafeSaiGon_CHI_CAP_NHAT_OTP.zip`) và giải nén đè đúng thư mục; bản vá **không chứa database**, không xóa dữ liệu.

Nếu dùng ZIP **project đầy đủ** để mở ở thư mục mới, hãy **sao lưu** `backend/CafeSaiGon.Api/ca-phe-sai-gon.db` từ thư mục đang chạy trên máy rồi **chép vào cùng đường dẫn** trong thư mục mới trước khi chạy, nếu muốn giữ tài khoản, đơn hàng hiện tại.

## Database và migrations

- `backend/CafeSaiGon.Api/ca-phe-sai-gon.db`: file SQLite sản phẩm từ bản ZIP gốc. Nên sao lưu trước khi thử chức năng xóa/sửa.
- `backend/CafeSaiGon.Api/Data/CafeDbContext.cs`: các DbSet; `Migrations/20261027010000_AddAccountsOrders.cs`: tạo Users, Orders, OrderItems; migration `20261027150000_AddEmailVerificationCodes.cs` thêm cột OTP.
- Muốn xem migration: `dotnet ef migrations list` (cần cài `dotnet-ef` phù hợp .NET 10). **Không cần cài dotnet-ef để chạy website**.
- Không xóa database khi có đơn thực tế; nếu xóa, lịch sử đơn cũng mất.

## Ảnh và giao diện

- Sử dụng **toàn bộ ảnh JPG thật** trong `public/images/photos/` từ bản bạn gửi. Ảnh JPG được ưu tiên, SVG chỉ là fallback nếu thiếu JPG.
- Ảnh tròn cạnh tên **Cà Phê Sài Gòn** đã chuyển từ biểu tượng giả sang ảnh cà phê thật.
- Trang chủ, sản phẩm, vùng trồng, pha chế và các trang gốc được giữ lại.

## API cơ bản

| Method | Endpoint | Ai được dùng |
|---|---|---|
| GET | `/api/products` | Mọi người |
| GET | `/api/products/{id}` | Mọi người |
| POST/PUT/DELETE | `/api/products` (hoặc `/{id}`) | Admin |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email`, `/api/auth/resend-code` | Chưa đăng nhập |
| GET | `/api/auth/me` | Đã đăng nhập |
| GET, POST | `/api/orders` | Theo vai trò |
| PUT | `/api/orders/{id}/approve` | Admin |
| PUT | `/api/orders/{id}/status` | Staff/Admin, phiếu đã duyệt |
| GET | `/api/orders/{id}/receipt.txt` | Người có quyền xem phiếu |
| GET, PUT | `/api/admin/users/staff-pending`, `/api/admin/users/{id}/approve` | Admin |

## Lưu ý trước triển khai công khai

Đây là project phát triển/học tập. **Chưa được kiểm thử end-to-end trên Windows trong môi trường tạo ZIP này.** Không dùng khóa/mật khẩu phát triển cho môi trường production và không ghi SMTP password vào mã nguồn. Cần thêm rate limit theo IP, reset mật khẩu, audit log, HTTPS, quản lý secrets, phiên đăng nhập an toàn hơn và kiểm thử bảo mật. Môi trường production bắt buộc cung cấp `Jwt__Key` và cấu hình Admin rõ ràng.

Nếu bị Smart App Control chặn: **không tắt Windows Security**. Dùng Terminal VS Code để chạy trực tiếp `dotnet` và `npm.cmd` chính hãng như trên; gửi nguyên thông báo nếu vẫn bị chặn.
