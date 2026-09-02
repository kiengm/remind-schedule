# Remind Schedule Client

Ứng dụng Frontend cho hệ thống Remind Schedule, xây dựng bằng **React + TypeScript + Vite + Tailwind CSS**.

---

## ✨ Tính năng chính

- 📋 Xem danh sách lịch nhắc nhở kèm mức độ ưu tiên (Thấp, Bình thường, Cao, Khẩn cấp) và cờ Quá hạn (Overdue).
- ➕ Tạo mới lịch nhắc nhở qua modal tương tác trực quan.
- ✅ Đánh dấu hoàn thành / chưa hoàn thành với cập nhật thời gian thực.
- 🗑️ Xóa lịch nhắc.
- 🔍 Tìm kiếm lịch nhắc theo từ khóa tiêu đề hoặc nội dung.
- 📊 Bộ lọc trạng thái thông minh: Tất cả, Đang chờ, Đã hoàn thành, Quá hạn kèm bộ đếm số lượng.
- 🔄 Đồng bộ trực tiếp với `remind-schedule-server` thông qua RESTful API.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu
- Node.js >= 18
- Yarn >= 1.22 hoặc Yarn Modern (v4)

### Cài đặt dependencies
```bash
yarn install
```

### Chạy ở chế độ phát triển (Development)
```bash
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

> [!NOTE]
> Mặc định client sẽ gọi API đến `http://localhost:3000/api/v1`. Hãy đảm bảo `remind-schedule-server` đã được bật trước khi khởi chạy client.

### Build bản Production
```bash
yarn build
```

