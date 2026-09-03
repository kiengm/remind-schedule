/**
 * Cấu hình toàn bộ URL và Endpoints của hệ thống dưới dạng Object
 * Single Source of Truth: Quản lý tập trung tất cả routes và sub-routes (:id, register, login,...)
 */
export const API_VERSION = 'v1';
export const API_BASE = 'api';
export const API_PREFIX = `${API_BASE}/${API_VERSION}`; // 'api/v1'

export const ENDPOINTS = {
  // Tiền tố chung
  BASE: API_PREFIX,

  // 1. Module Xác thực (Auth)
  AUTH: {
    ROOT: `${API_PREFIX}/auth`,
    REGISTER: 'register',
    LOGIN: 'login',
    ME: 'me',
    // Đường dẫn tuyệt đối (tiện lợi cho Client/Test)
    FULL: {
      REGISTER: `/${API_PREFIX}/auth/register`,
      LOGIN: `/${API_PREFIX}/auth/login`,
      ME: `/${API_PREFIX}/auth/me`,
    },
  },

  // 2. Module Lịch nhắc nhở (Reminders)
  REMINDERS: {
    ROOT: `${API_PREFIX}/reminders`,
    CREATE: '',            // POST /api/v1/reminders
    LIST: '',              // GET  /api/v1/reminders
    BY_ID: ':id',          // GET  /api/v1/reminders/:id
    UPDATE: ':id',         // PATCH /api/v1/reminders/:id
    DELETE: ':id',         // DELETE /api/v1/reminders/:id
    // Helper tạo URL động kèm tham số
    urlWithId: (id: string) => `/${API_PREFIX}/reminders/${id}`,
  },
} as const;

// Alias để tương thích ngược
export const API_ROUTES = {
  AUTH: ENDPOINTS.AUTH.ROOT,
  REMINDERS: ENDPOINTS.REMINDERS.ROOT,
} as const;
