import { apiRequest } from '../utils/api';

export const reservationApi = {
  create: (payload: any) =>
    apiRequest('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  // 예약 목록, 상세 등도 추가 가능
}; 