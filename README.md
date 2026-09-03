# Remind Schedule Project

Dự án bao gồm 2 thành phần độc lập được quản lý chung qua Yarn Workspace:
1. **`remind-schedule-server`**: RESTful API xây dựng bằng **NestJS** theo chuẩn **The Clean Architecture**.
2. **`remind-schedule-client`**: Web UI xây dựng bằng **React + Vite + TypeScript + Tailwind CSS (Shadcn/UI & Atomic Design)**.

---

## ⚡ Các lệnh khởi chạy từ thư mục gốc (Root)

Từ thư mục gốc `remind-schedule/`, bạn có thể chạy trực tiếp:

### 1. Khởi chạy Server ở chế độ Development:
```bash
yarn server dev
```
*(hoặc `yarn server:dev`)*
- Server API chạy tại: `http://localhost:3000`
- Swagger UI tài liệu API: `http://localhost:3000/api/docs`

### 2. Khởi chạy Client ở chế độ Development:
```bash
yarn client dev
```
*(hoặc `yarn client:dev`)*
- Giao diện web chạy tại: `http://localhost:5173`

### 3. Build Production từ thư mục gốc:
```bash
# Build Server
yarn server build

# Build Client
yarn client build
```

---

## 📁 Cấu trúc thư mục dự án

```
remind-schedule/
├── package.json                    # Root Workspace configuration
├── .yarnrc.yml                     # nodeLinker: node-modules
├── docker-compose.yml              # Dịch vụ MySQL / DynamoDB
│
├── remind-schedule-server/         # Backend NestJS (Clean Architecture)
│   ├── src/
│   │   ├── core/                   # Tầng 1: Entities (Enterprise Business Rules)
│   │   ├── application/            # Tầng 2: Use Cases (Input/Output Ports & Interactors)
│   │   ├── adapters/               # Tầng 3: Interface Adapters (Controllers, Presenters, Gateways)
│   │   ├── infrastructure/         # Tầng 4: Frameworks & Drivers (Filters, Interceptors, Prisma)
│   │   └── main.ts
│   ├── prisma/                     # Schema và DDL SQL
│   └── package.json
│
└── remind-schedule-client/         # Frontend React (Shadcn/UI & Atomic Design)
    ├── src/
    │   ├── components/
    │   │   ├── atoms/              # Atoms: Button, Input, Badge, Label, Card, Avatar
    │   │   ├── molecules/          # Molecules: FormField, SearchBox, StatCard, FilterTabs, UserNav
    │   │   └── organisms/          # Organisms: Navbar, ReminderItem, ReminderStatsBar, AuthHeader,...
    │   ├── features/               # API, Hooks, Types
    │   └── App.tsx                 # Main Dashboard
    └── package.json
```
