export const API_VERSION = 'v1';
export const API_BASE = 'api';
export const API_PREFIX = `${API_BASE}/${API_VERSION}`; // 'api/v1'

export const ENDPOINTS = {
  BASE: API_PREFIX,

  // 1. Module Xác thực (Auth / Users)
  AUTH: {
    ROOT: `${API_PREFIX}/auth`,
    REGISTER: 'register',
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'logout',
    ME: 'me',
    FULL: {
      REGISTER: `/${API_PREFIX}/auth/register`,
      LOGIN: `/${API_PREFIX}/auth/login`,
      REFRESH_TOKEN: `/${API_PREFIX}/auth/refresh-token`,
      LOGOUT: `/${API_PREFIX}/auth/logout`,
      ME: `/${API_PREFIX}/auth/me`,
    },
  },

  // 2. Module Lịch nhắc nhở (Reminders)
  REMINDERS: {
    ROOT: `${API_PREFIX}/reminders`,
    CREATE: '', // POST /api/v1/reminders
    LIST: '', // GET  /api/v1/reminders
    TEMPLATE: 'excel/template', // GET /api/v1/reminders/excel/template
    IMPORT: 'excel/import', // POST /api/v1/reminders/excel/import
    BY_ID: ':id', // GET  /api/v1/reminders/:id
    UPDATE: ':id', // PATCH /api/v1/reminders/:id
    DELETE: ':id', // DELETE /api/v1/reminders/:id
    urlWithId: (id: string) => `/${API_PREFIX}/reminders/${id}`,
  },
} as const;

export const API_ROUTES = {
  AUTH: ENDPOINTS.AUTH.ROOT,
  REMINDERS: ENDPOINTS.REMINDERS.ROOT,
} as const;
