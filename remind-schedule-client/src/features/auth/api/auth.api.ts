import { apiClient } from '../../../services/api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../../../types/auth';
import { ApiResponse } from '../../../types/reminder';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data.data;
  },

  async getProfile(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};

