# Remind Schedule Server (Clean Architecture)

Backend RESTful API cho ứng dụng quản lý lịch nhắc nhở, được xây dựng bằng **NestJS** và tuân thủ chặt chẽ nguyên lý **The Clean Architecture** (Robert C. Martin - Uncle Bob).

---

## 🏛️ Kiến trúc Clean Architecture

Dự án được phân tầng theo 4 vòng tròn đồng tâm từ trong ra ngoài:

```
src/
├── core/                           # 1. ENTITIES (Enterprise Business Rules)
│   ├── domain/
│   │   ├── entities/               # Entity thuần túy, không phụ thuộc Framework/ORM
│   │   │   └── reminder.entity.ts
│   │   └── enums/                  # Enums, Types, Value Objects
│   │       ├── reminder-status.enum.ts
│   │       └── reminder-priority.enum.ts
│   └── index.ts
│
├── application/                    # 2. USE CASES (Application Business Rules)
│   ├── ports/
│   │   ├── in/                     # Input Ports (Interfaces mà Controller gọi)
│   │   │   ├── create-reminder.use-case.ts
│   │   │   ├── get-reminders.use-case.ts
│   │   │   ├── update-reminder.use-case.ts
│   │   │   └── delete-reminder.use-case.ts
│   │   └── out/                    # Output Ports (Interfaces mà Interactor gọi ra ngoài)
│   │       └── reminder-repository.port.ts
│   └── use-cases/                  # Interactors (Triển khai logic nghiệp vụ ứng dụng)
│       ├── create-reminder.interactor.ts
│       ├── get-reminders.interactor.ts
│       ├── update-reminder.interactor.ts
│       └── delete-reminder.interactor.ts
│
├── adapters/                       # 3. INTERFACE ADAPTERS
│   ├── controllers/                # REST Controllers (Endpoints HTTP)
│   │   ├── dtos/                   # Request DTOs và Validation
│   │   │   ├── create-reminder.dto.ts
│   │   │   └── update-reminder.dto.ts
│   │   └── reminder.controller.ts
│   ├── presenters/                 # Presenters / ViewModels (Chuẩn hóa Response trả về)
│   │   └── reminder.presenter.ts
│   └── gateways/                   # Repository Implementations (Thực hiện Output Ports)
│       └── in-memory-reminder.repository.ts
│
├── infrastructure/                 # 4. FRAMEWORKS & DRIVERS
│   └── common/
│       ├── filters/                # Global HttpExceptionFilter
│       └── interceptors/           # Global TransformResponseInterceptor
│
├── modules/                        # NestJS Dependency Injection Container
│   ├── reminder.tokens.ts          # Injection Tokens (Symbols)
│   ├── reminder.module.ts          # Wiring Ports, Interactors & Gateways
│   └── app.module.ts               # Root Module
└── main.ts                         # Bootstrap entry point
```

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu
- Node.js >= 18
- Yarn >= 1.22 hoặc Yarn Modern (v4)

### Cài đặt dependencies
```bash
yarn install
```

### Cấu hình Cơ sở dữ liệu (MySQL & Prisma)
1. Cấu hình chuỗi kết nối trong file `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/remind_schedule"
```

2. Nếu chưa có MySQL, bạn có thể chạy nhanh bằng Docker:
```bash
docker compose up -d
```

3. Đồng bộ schema lên MySQL:
```bash
yarn prisma:push
# hoặc tạo migration:
yarn prisma:migrate
```

4. Mở giao diện trực quan Prisma Studio:
```bash
yarn prisma:studio
```

### Chạy ở chế độ phát triển (Development)
```bash
yarn start:dev
```

Server sẽ khởi động tại: `http://localhost:3000`

### Tài liệu API (Swagger UI)
Truy cập: `http://localhost:3000/api/docs`

---

## 📡 Các RESTful API Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/v1/reminders` | Tạo mới một lịch nhắc |
| `GET` | `/api/v1/reminders` | Lấy danh sách tất cả các lịch nhắc |
| `GET` | `/api/v1/reminders/:id` | Xem chi tiết lịch nhắc theo ID |
| `PATCH` | `/api/v1/reminders/:id` | Cập nhật thông tin / trạng thái lịch nhắc |
| `DELETE` | `/api/v1/reminders/:id` | Xóa một lịch nhắc |

