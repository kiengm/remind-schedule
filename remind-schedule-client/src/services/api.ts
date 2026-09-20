import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  CreateReminderPayload,
  Reminder,
  UpdateReminderPayload,
} from '../types/reminder';
import { RefreshTokenResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Gắn Bearer Token và Accept-Language tự động từ localStorage vào mỗi request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('app_lang') || 'vi';

  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = lang;
  }
  return config;
});

// 2. Response Interceptor: Tự động refresh token và replay request khi bị lỗi 401 Unauthorized
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new CustomEvent('auth:expired'));
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Nếu không có response hoặc request bị hủy
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || '';

    // Bỏ qua không refresh nếu lỗi đến từ các endpoint auth đặc thù
    if (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // Nếu là lỗi 401 Unauthorized và chưa từng thử retry request này
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (!currentRefreshToken) {
        clearAuthSession();
        return Promise.reject(error);
      }

      // Nếu đang trong quá trình gọi API refresh token -> Xếp request vào hàng đợi chờ token mới
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      // Bắt đầu quá trình Refresh Token
      isRefreshing = true;

      try {
        // Dùng axios instance cơ bản để tránh bị lặp interceptor
        const res = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: currentRefreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Lưu cặp token mới vào localStorage
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Cập nhật header Authorization cho request ban đầu
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Xử lý tất cả các request đang chờ trong queue
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshErr) {
        // Nếu refresh token cũng hết hạn hoặc không hợp lệ -> Xóa phiên đăng nhập
        processQueue(refreshErr, null);
        clearAuthSession();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const reminderApi = {
  async getAll(): Promise<Reminder[]> {
    const res = await apiClient.get<ApiResponse<Reminder[]>>('/reminders');
    return res.data.data;
  },

  async getById(id: string): Promise<Reminder> {
    const res = await apiClient.get<ApiResponse<Reminder>>(`/reminders/${id}`);
    return res.data.data;
  },

  async create(payload: CreateReminderPayload): Promise<Reminder> {
    const res = await apiClient.post<ApiResponse<Reminder>>('/reminders', payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateReminderPayload): Promise<Reminder> {
    const res = await apiClient.patch<ApiResponse<Reminder>>(`/reminders/${id}`, payload);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  },
};
