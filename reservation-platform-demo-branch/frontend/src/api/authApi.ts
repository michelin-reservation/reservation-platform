import { apiRequest } from '../utils/api';
import { vipUsers, findUserById, userStats } from '../data/users';

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; token: string; user: any }>(
      '/api/users/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),
  register: (payload: any) =>
    apiRequest<{ success: boolean; token?: string; user?: any }>('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProfile: (payload: { name: string; email: string; currentPassword?: string; newPassword?: string }) =>
    apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  // 회원가입, 내 정보 등도 추가 가능
}; 