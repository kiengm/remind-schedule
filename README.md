# Remind Schedule Project

Dự án bao gồm 2 thành phần độc lập:
1. **`remind-schedule-server`**: RESTful API xây dựng bằng **NestJS** theo chuẩn **The Clean Architecture**.
2. **`remind-schedule-client`**: Web UI xây dựng bằng **React + Vite + TypeScript + Tailwind CSS**.

---

## 📁 Cấu trúc thư mục

```
remind-schedule/
├── remind-schedule-server/         # Backend NestJS (Clean Architecture)
│   ├── src/
│   │   ├── core/                   # Tầng 1: Entities (Enterprise Business Rules)
│   │   ├── application/            # Tầng 2: Use Cases (Input/Output Ports & Interactors)
│   │   ├── adapters/               # Tầng 3: Interface Adapters (Controllers, Presenters, Gateways)
│   │   ├── infrastructure/         # Tầng 4: Frameworks & Drivers (Filters, Interceptors)
│   │   ├── modules/                # Dependency Injection Modules
│   │   └── main.ts
│   └── package.json
│
└── remind-schedule-client/         # Frontend React + Vite
    ├── src/
    │   ├── features/reminders/     # Components, Hooks, API services
    │   ├── types/                  # TypeScript Types
    │   ├── App.tsx                 # Dashboard chính
    │   └── main.tsx
    └── package.json
```

---

## ⚡ Hướng dẫn khởi chạy nhanh

### 1. Khởi chạy Server (Backend)
Mở một terminal mới:
```bash
cd remind-schedule-server
yarn start:dev
```
- API chạy tại: `http://localhost:3000`
- Swagger UI tài liệu API: `http://localhost:3000/api/docs`

### 2. Khởi chạy Client (Frontend)
Mở một terminal thứ hai:
```bash
cd remind-schedule-client
yarn dev
```
- Giao diện web chạy tại: `http://localhost:5173`

