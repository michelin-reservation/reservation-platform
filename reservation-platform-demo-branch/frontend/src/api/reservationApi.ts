import { apiRequest } from '../utils/api';

export const reservationApi = {
  create: (payload: any) => {
    // date, time → reservation_time(ISO string) 변환
    let reservation_time = undefined;
    if (payload.date && payload.time) {
      reservation_time = new Date(`${payload.date}T${payload.time}`).toISOString();
    }
    return apiRequest('/api/reservations', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        reservation_time,
        guest_count: Number(payload.guests),
        special_request: payload.specialRequest,
        restaurant_id: payload.restaurant_id, // 필요시 상위에서 전달
      }),
    });
  },
  // 예약 목록, 상세 등도 추가 가능
}; 