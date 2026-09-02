import axios from 'axios';
import { ApiResponse, CreateReminderPayload, Reminder, UpdateReminderPayload } from '../types/reminder';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn Bearer Token tự động từ localStorage vào mỗi request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
