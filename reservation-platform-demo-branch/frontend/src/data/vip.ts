// VIP 통계 데이터
export interface VipStats {
  totalReservations: number;
  totalSpent: number;
  averageRating: number;
  favoriteRestaurants: number;
  vipLevel: string;
  benefitsUsed: number;
}

// VIP 혜택 데이터
export interface VipBenefit {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  usedCount: number;
  maxUses: number;
}

// VIP 예약 데이터
export interface VipReservation {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  people: number;
  status: string;
  priority: boolean;
}

// VIP 컨시어지 서비스 데이터
export interface VipConciergeService {
  id: string;
  title: string;
  description: string;
  features: string[];
}

// VIP 통계 기본 데이터
export const defaultVipStats: VipStats = {
  totalReservations: 28,
  totalSpent: 3250000,
  averageRating: 4.8,
  favoriteRestaurants: 12,
  vipLevel: 'Platinum',
  benefitsUsed: 8
};

// VIP 추가 통계 데이터
export const additionalVipStats = {
  currentYear: {
    reviewsWritten: 25,
    specialEvents: 8
  },
  lastYear: {
    reservations: 24,
    spent: 2800000,
    averageRating: 4.6
  },
  lifetime: {
    memberSince: '2022-03-15'
  },
  goals: {
    nextLevel: 'Diamond',
    reservationsNeeded: 3,
    spendingNeeded: 750000
  }
};

// 월별 데이터
export const monthlyVipData = [
  { month: '1월', reservations: 3, spending: 450000 },
  { month: '2월', reservations: 2, spending: 320000 },
  { month: '3월', reservations: 4, spending: 580000 },
  { month: '4월', reservations: 3, spending: 420000 },
  { month: '5월', reservations: 5, spending: 650000 },
  { month: '6월', reservations: 2, spending: 280000 },
  { month: '7월', reservations: 3, spending: 390000 },
  { month: '8월', reservations: 4, spending: 520000 },
  { month: '9월', reservations: 2, spending: 250000 }
];

// 업적 데이터
export const vipAchievements = [
  {
    id: '1',
    title: '미식가',
    description: '미쉐린 스타 레스토랑 10곳 방문',
    achieved: true,
    date: '2024-08-15'
  },
  {
    id: '2',
    title: '단골 고객',
    description: '연간 25회 이상 예약',
    achieved: true,
    date: '2024-11-20'
  },
  {
    id: '3',
    title: '리뷰어',
    description: '리뷰 20개 이상 작성',
    achieved: true,
    date: '2024-10-05'
  },
  {
    id: '4',
    title: 'VIP 플래티넘',
    description: '플래티넘 등급 달성',
    achieved: true,
    date: '2024-06-01'
  }
];

// VIP 혜택 기본 데이터
export const defaultVipBenefits: VipBenefit[] = [
  {
    id: '1',
    name: '무료 발레파킹',
    description: '모든 미쉐린 레스토랑에서 발레파킹 서비스 무료 이용',
    isActive: true,
    usedCount: 3,
    maxUses: 10
  },
  {
    id: '2',
    name: '전용 컨시어지',
    description: '24시간 VIP 전용 컨시어지 서비스 이용',
    isActive: true,
    usedCount: 1,
    maxUses: 5
  },
  {
    id: '3',
    name: '특별 메뉴 제공',
    description: 'VIP 전용 특별 메뉴 및 와인 페어링 서비스',
    isActive: true,
    usedCount: 8,
    maxUses: 20
  },
  {
    id: '4',
    name: '우선 예약',
    description: '인기 레스토랑 우선 예약 및 확정 보장',
    isActive: true,
    usedCount: 12,
    maxUses: 50
  }
];

// VIP 예약 기본 데이터
export const defaultVipReservations: VipReservation[] = [
  {
    id: '1',
    restaurantName: '라 스칼라',
    date: '2024-12-15',
    time: '19:00',
    people: 4,
    status: '확정',
    priority: true
  },
  {
    id: '2',
    restaurantName: '르 베르나르',
    date: '2024-12-20',
    time: '18:30',
    people: 2,
    status: '대기',
    priority: true
  }
];

// VIP 컨시어지 서비스 데이터
export const vipConciergeServices: VipConciergeService[] = [
  {
    id: 'reservation',
    title: '특별 예약 서비스',
    description: '인기 레스토랑 특별 예약 및 맞춤형 코스 구성',
    features: ['우선 예약 보장', '셰프와의 미팅', '특별 메뉴 구성', '기념일 장식 서비스']
  },
  {
    id: 'transportation',
    title: '교통편 서비스',
    description: '프리미엄 차량 서비스 및 발레파킹 예약',
    features: ['프리미엄 차량 예약', '발레파킹 서비스', '공항 픽업/드롭', '도시 투어 가이드']
  },
  {
    id: 'event',
    title: '이벤트 기획',
    description: '특별한 날을 위한 맞춤형 이벤트 기획 및 실행',
    features: ['생일/기념일 파티', '비즈니스 미팅', '프로포즈 이벤트', '가족 모임']
  },
  {
    id: 'recommendation',
    title: '맞춤 추천',
    description: '개인 취향에 맞는 레스토랑 및 메뉴 추천',
    features: ['개인 취향 분석', '시즌 메뉴 추천', '와인 페어링', '다이어트 메뉴']
  }
];

// VIP 등급별 혜택 정보
export const vipLevelBenefits = {
  gold: {
    name: 'Gold',
    requirements: '연간 예약 10회 또는 누적 사용금액 100만원',
    benefits: ['우선 예약', '발레파킹 50% 할인', '생일 축하 메뉴']
  },
  platinum: {
    name: 'Platinum',
    requirements: '연간 예약 25회 또는 누적 사용금액 300만원',
    benefits: ['무료 발레파킹', '전용 컨시어지', '특별 메뉴 제공', '우선 예약']
  },
  diamond: {
    name: 'Diamond',
    requirements: '연간 예약 50회 또는 누적 사용금액 500만원',
    benefits: ['모든 Platinum 혜택', '셰프 테이블 보장', '개인 매니저', 'VIP 전용 이벤트']
  }
}; 