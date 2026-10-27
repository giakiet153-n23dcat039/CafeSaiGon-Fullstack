# CÀ PHÊ SÀI GÒN — BẬT XÁC THỰC EMAIL BẰNG MÃ OTP 6 SỐ

**Bản này gửi mã thật qua email**, không còn in link hay OTP ra Terminal. Nếu chưa cấu hình SMTP, người dùng sẽ nhận thông báo rõ ràng, không bị báo gửi thành công giả.

## 1. Chuẩn bị Gmail dùng để GỬI email

Nên tạo một hộp thư riêng cho website (ví dụ: `your-business-email@gmail.com`). Tại Google Account của hộp thư đó, bật **Xác minh 2 bước**. Nếu Google cho phép, vào trang https://myaccount.google.com/apppasswords để tạo **App password** 16 ký tự.

- Đây là **mật khẩu ứng dụng**, KHÔNG phải mật khẩu đăng nhập Gmail bình thường.
- Một số tài khoản cơ quan/trường học hoặc có Advanced Protection không hỗ trợ App passwords. Trường hợp đó cần dịch vụ gửi mail SMTP/OAuth khác.
- Không gửi App password cho bất kỳ ai, không ghi vào source hay chat công khai.

## 2. Lưu SMTP bằng .NET User Secrets (chạy một lần)

Mở **CMD** trong thư mục `web-ca-phe-sai-gon\backend\CafeSaiGon.Api` (nơi có `CafeSaiGon.Api.csproj`), sau đó chạy từng lệnh:

```cmd
 dotnet user-secrets set "Smtp:Host" "smtp.gmail.com"
 dotnet user-secrets set "Smtp:Port" "587"
 dotnet user-secrets set "Smtp:Username" "YOUR_GMAIL@gmail.com"
 dotnet user-secrets set "Smtp:From" "YOUR_GMAIL@gmail.com"
 dotnet user-secrets set "Smtp:Password" "YOUR_16_CHARACTER_APP_PASSWORD"
```

Thay `YOUR_GMAIL@gmail.com` và `YOUR_16_CHARACTER_APP_PASSWORD` bằng thông tin của **bạn**; bỏ khoảng trắng nếu mã App password được hiển thị thành các nhóm. Chỉ chạy trên máy riêng của bạn; các bí mật này lưu ngoài thư mục project (phục vụ development), không nằm trong ZIP.

**Thực tế:** Nếu bạn dùng nhà cung cấp SMTP khác, đổi `Host`, `Port`, `Username`, `Password` và `From` theo thông số họ cung cấp. Bản này dùng STARTTLS, thường qua cổng 587.

## 3. Khởi chạy như trước — không cần Git hay BAT

**Terminal/CMD 1 — Back-end** (trong thư mục API):

```cmd
 dotnet restore
 dotnet run --launch-profile http
```

EF Core sẽ tự chạy migration `AddEmailVerificationCodes` và **giữ nguyên database SQLite + sản phẩm + tài khoản + đơn hàng cũ**.

**Terminal/CMD 2 — Front-end** (trong thư mục `web-ca-phe-sai-gon`):

```cmd
 npm.cmd ci
 npm.cmd run dev -- --port 3000
```

`npm ci` đặc biệt quan trọng nếu từng gặp lỗi `Cannot find module ... vite.js`; cài lại thư viện đúng bản thay vì dựa vào `node_modules` thiếu file trong ZIP trước.

## 4. Kiểm thử

1. Mở `http://localhost:3000/login`, chọn **Đăng ký**.
2. Nhập **email thật** bạn truy cập được, mật khẩu >= 8 ký tự và họ tên.
3. Bấm **Đăng ký & nhận mã email**. Trang sẽ chuyển tới `/verify-email`.
4. Mở hộp thư hoặc Spam, lấy **mã 6 số** gửi từ hộp thư SMTP bạn cấu hình.
5. Nhập OTP và bấm **Xác thực tài khoản**, sau đó đăng nhập. Nhân viên phải chờ Admin duyệt.
6. Nếu email đã đăng ký từ **bản cũ** nhưng chưa xác thực, vào trực tiếp `/verify-email?email=...`, bấm **Gửi lại mã OTP** để nhận mã mới.
7. Nút Gửi lại mã có thời gian đếm 60 giây. Mã cũ vô hiệu khi mã mới được gửi.

## 5. API kiểm thử (qua Axios)

| Phương thức | URL | JSON body |
|---|---|---|
| POST | `/api/auth/register` | `{ "email": "...", "password": "...", "fullName": "...", "applyAsStaff": false }` |
| POST | `/api/auth/verify-email` | `{ "email": "...", "code": "123456" }` |
| POST | `/api/auth/resend-code` | `{ "email": "..." }` |
| POST | `/api/auth/login` | `{ "email": "...", "password": "..." }` |

`123456` chỉ là ví dụ định dạng; bạn phải nhập **mã thật** trong email. API không trả mã về trình duyệt.

## 6. Lỗi thường gặp

- **503 Chưa cấu hình SMTP:** chạy lại bước 2 tại ĐÚNG thư mục API và khởi động lại Back-end.
- **503 Không gửi được email:** sai App password, Gmail từ chối đăng nhập, cổng 587 bị chặn, mất internet hoặc cấu hình From/Username không đúng.
- **Không thấy thư:** kiểm tra Spam; email nhận có thể chậm; chỉ bấm gửi lại sau 60 giây.
- **400 Mã không đúng:** kiểm tra mã mới nhất, 6 chữ số, không dùng mã đã hết 10 phút.
- **429:** gửi lại quá sớm, quá 5 mã/24h, nhập sai OTP 5 lần, hoặc nhiều request đến từ cùng địa chỉ IP.
- **Trình duyệt không kết nối Front-end:** trong thư mục gốc chạy `npm.cmd ci` rồi `npm.cmd run dev`.

**Bảo mật:** Không thêm mật khẩu email vào `appsettings.json`, React, GitHub hay ZIP. User-secrets không được mã hóa nên chỉ dùng cho phát triển tại máy riêng. Khi triển khai production, dùng secret manager và HTTPS, đồng thời thiết lập SMTP nhà cung cấp hỗ trợ an toàn tốt hơn.
