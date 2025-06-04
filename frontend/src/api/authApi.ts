import { apiRequest } from '../utils/api';

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
  // 회원가입, 내 정보 등도 추가 가능
}; 