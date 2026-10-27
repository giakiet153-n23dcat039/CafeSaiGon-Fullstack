# ASP.NET Core API + React/Axios + EF Core

Xem **`START_HERE.md`** để chạy phiên bản hoàn chỉnh. Không tải Git, không chạy BAT/PS1.

- API: `backend/CafeSaiGon.Api/`
- Entity Framework Core: `Data/CafeDbContext.cs`, `Migrations/`
- CRUD sản phẩm, phân quyền Admin: `Controllers/ProductsController.cs`
- Đăng nhập và xác thực email: `Controllers/AuthController.cs`
- Quản trị nhân viên: `Controllers/AdminUsersController.cs`
- Phiếu đặt hàng: `Controllers/OrdersController.cs`
- Axios: `src/services/productApi.js`, `src/services/authApi.js`
- Database: `backend/CafeSaiGon.Api/ca-phe-sai-gon.db` (giữ 6 sản phẩm gốc)

### Chạy

```powershell
# Terminal 1 tại thư mục project
cd backend/CafeSaiGon.Api
dotnet restore
dotnet run --launch-profile http
```

```powershell
# Terminal 2 tại thư mục project
npm.cmd run dev
```

Vào `http://localhost:3000`. Admin được tạo với mật khẩu ngẫu nhiên hiển thị trong Terminal Backend lần đầu.

### Phân quyền

`GET /api/products` công khai; `POST/PUT/DELETE /api/products` chỉ Admin. `/api/orders` giới hạn theo JWT và vai trò. `Staff` chỉ thấy phiếu đã duyệt.

Xem `START_HERE.md` để biết cấu hình SMTP, token xác thực email, mức khóa đăng nhập, giới hạn bảo mật của môi trường development.
