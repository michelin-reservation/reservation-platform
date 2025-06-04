const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // 글로벌 에러 핸들러: 401 인증 실패 시 자동 로그아웃 및 로그인 페이지 이동
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new ApiError(data?.message || 'API 요청 실패', res.status);
  }
  return data;
} 