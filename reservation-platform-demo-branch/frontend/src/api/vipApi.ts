import { API_BASE_URL } from './config';
import { loginUser, getLoginAccounts } from '../data/users';

export interface VipRequest {
  id: string;
  userId: string;
  companyName: string;
  vipCardNumber: string;
  status: '대기' | '승인' | '거절';
  requestDate: string;
  createdAt: string;
}

export interface VipStats {
  totalReservations: number;
  totalSpent: number;
  averageRating: number;
  favoriteRestaurants: number;
  vipLevel: string;
  benefitsUsed: number;
}

export interface VipBenefit {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  usedCount: number;
  maxUses: number;
}

export interface VipReservation {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  people: number;
  status: string;
  priority: boolean;
}

// VIP 요청 생성
export const createVipRequest = async (data: {
  companyName: string;
  vipCardNumber: string;
}): Promise<VipRequest> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/vip-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('VIP 요청 생성에 실패했습니다.');
  }

  return response.json();
};

// 사용자의 VIP 요청 목록 조회
export const getUserVipRequests = async (): Promise<VipRequest[]> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  const response = await fetch(`${API_BASE_URL}/api/vip-requests/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('VIP 요청 목록 조회에 실패했습니다.');
  }

  return response.json();
};

// VIP 통계 조회
export const getVipStats = async (): Promise<VipStats> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/vip-stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('VIP 통계 조회에 실패했습니다.');
  }

  return response.json();
};

// VIP 혜택 목록 조회
export const getVipBenefits = async (): Promise<VipBenefit[]> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/vip-benefits`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('VIP 혜택 목록 조회에 실패했습니다.');
  }

  return response.json();
};

// VIP 예약 목록 조회
export const getVipReservations = async (): Promise<VipReservation[]> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/vip-reservations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('VIP 예약 목록 조회에 실패했습니다.');
  }

  return response.json();
};

// VIP 혜택 사용
export const useVipBenefit = async (benefitId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/vip-benefits/${benefitId}/use`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('VIP 혜택 사용에 실패했습니다.');
  }
};

// VIP 컨시어지 요청
export const requestVipConcierge = async (data: {
  type: string;
  description: string;
  preferredDate?: string;
}): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/vip-concierge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('컨시어지 요청에 실패했습니다.');
  }
};

// 로그인 시도
const user = loginUser('vip@test.com', 'password123');

// 로그인 가능한 계정 목록 확인 (테스트용)
const accounts = getLoginAccounts(); 