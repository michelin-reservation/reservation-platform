// 예약 타입 정의
export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

// 예약 데이터
export const reservations: Reservation[] = [
  {
    id: 'res_001',
    userId: 'vip_001',
    restaurantId: 'restaurant_001',
    restaurantName: '라 스칼라',
    userName: 'VIP 사용자',
    userEmail: 'vip@test.com',
    date: '2024-12-25',
    time: '19:00',
    guests: 2,
    specialRequest: '창가 자리 부탁드립니다',
    status: 'confirmed',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    totalAmount: 150000,
    paymentStatus: 'paid'
  },
  {
    id: 'res_002',
    userId: 'vip_002',
    restaurantId: 'restaurant_002',
    restaurantName: '르 베르나르',
    userName: '플래티넘 사용자',
    userEmail: 'platinum@test.com',
    date: '2024-12-28',
    time: '20:00',
    guests: 4,
    specialRequest: '생일 축하 메뉴 준비해주세요',
    status: 'pending',
    createdAt: '2024-12-02T14:30:00Z',
    updatedAt: '2024-12-02T14:30:00Z',
    totalAmount: 280000,
    paymentStatus: 'pending'
  },
  {
    id: 'res_003',
    userId: 'user_001',
    restaurantId: 'restaurant_003',
    restaurantName: '미쉐린 카페',
    userName: '테스트 사용자',
    userEmail: 'user@test.com',
    date: '2024-12-20',
    time: '12:00',
    guests: 2,
    status: 'confirmed',
    createdAt: '2024-12-03T09:15:00Z',
    updatedAt: '2024-12-03T09:15:00Z',
    totalAmount: 45000,
    paymentStatus: 'paid'
  },
  {
    id: 'res_004',
    userId: 'vip_003',
    restaurantId: 'restaurant_001',
    restaurantName: '라 스칼라',
    userName: '다이아몬드 사용자',
    userEmail: 'diamond@test.com',
    date: '2024-12-30',
    time: '18:30',
    guests: 6,
    specialRequest: 'VIP 전용 테이블 부탁드립니다',
    status: 'confirmed',
    createdAt: '2024-12-04T16:45:00Z',
    updatedAt: '2024-12-04T16:45:00Z',
    totalAmount: 450000,
    paymentStatus: 'paid'
  }
];

// 예약 생성 함수
export const createReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Reservation => {
  const newReservation: Reservation = {
    ...reservationData,
    id: `res_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending',
    paymentStatus: 'pending'
  };
  
  reservations.push(newReservation);
  return newReservation;
};

// 사용자별 예약 조회
export const getUserReservations = (userId: string): Reservation[] => {
  return reservations.filter(reservation => reservation.userId === userId);
};

// 레스토랑별 예약 조회
export const getRestaurantReservations = (restaurantId: string): Reservation[] => {
  return reservations.filter(reservation => reservation.restaurantId === restaurantId);
};

// 예약 상태 업데이트
export const updateReservationStatus = (reservationId: string, status: Reservation['status']): Reservation | null => {
  const reservation = reservations.find(r => r.id === reservationId);
  if (reservation) {
    reservation.status = status;
    reservation.updatedAt = new Date().toISOString();
    return reservation;
  }
  return null;
};

// 예약 통계
export const getReservationStats = () => {
  const total = reservations.length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const cancelled = reservations.filter(r => r.status === 'cancelled').length;
  const completed = reservations.filter(r => r.status === 'completed').length;
  
  return {
    total,
    pending,
    confirmed,
    cancelled,
    completed
  };
}; 