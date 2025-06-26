// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: 'user' | 'vip' | 'business' | 'admin';
  password?: string; // 로그인용 비밀번호 추가
}

// VIP 사용자 타입
export interface VipUser extends User {
  role: 'vip';
  vipLevel: 'Gold' | 'Platinum' | 'Diamond';
  vipMemberSince: string;
  totalSpent: number;
  totalReservations: number;
  averageRating: number;
  favoriteRestaurants: number;
  benefitsUsed: number;
  points: number;
  tierProgress: {
    currentTier: string;
    nextTier: string;
    reservationsNeeded: number;
    spendingNeeded: number;
  };
}

// 비즈니스 사용자 타입
export interface BusinessUser extends User {
  role: 'business';
  businessName: string;
  businessType: 'restaurant' | 'cafe' | 'bar';
  businessAddress: string;
  businessPhone: string;
  businessLicense: string;
  restaurantId?: string;
  isVerified: boolean;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt: string;
}

// 로그인 가능한 사용자 데이터
export const loginUsers: (User | VipUser | BusinessUser)[] = [
  // 일반 사용자
  {
    id: 'user_001',
    email: 'user@test.com',
    name: '테스트 사용자',
    phone: '010-1234-5678',
    avatar: '/avatars/user1.jpg',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'user',
    password: 'password123'
  },
  {
    id: 'user_002',
    email: 'kim@test.com',
    name: '김일반',
    phone: '010-2345-6789',
    avatar: '/avatars/user2.jpg',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'user',
    password: 'password123'
  },
  
  // VIP 사용자
  {
    id: 'vip_001',
    email: 'vip@test.com',
    name: 'VIP 사용자',
    phone: '010-1111-2222',
    avatar: '/avatars/vip1.jpg',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    password: 'password123',
    vipLevel: 'Gold',
    vipMemberSince: '2023-06-15',
    totalSpent: 1200000,
    totalReservations: 15,
    averageRating: 4.5,
    favoriteRestaurants: 8,
    benefitsUsed: 3,
    points: 12000,
    tierProgress: {
      currentTier: 'Gold',
      nextTier: 'Platinum',
      reservationsNeeded: 10,
      spendingNeeded: 1800000
    }
  } as VipUser,
  {
    id: 'vip_002',
    email: 'platinum@test.com',
    name: '플래티넘 사용자',
    phone: '010-2222-3333',
    avatar: '/avatars/vip2.jpg',
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    password: 'password123',
    vipLevel: 'Platinum',
    vipMemberSince: '2022-03-15',
    totalSpent: 3250000,
    totalReservations: 28,
    averageRating: 4.8,
    favoriteRestaurants: 12,
    benefitsUsed: 8,
    points: 32500,
    tierProgress: {
      currentTier: 'Platinum',
      nextTier: 'Diamond',
      reservationsNeeded: 22,
      spendingNeeded: 1750000
    }
  } as VipUser,
  {
    id: 'vip_003',
    email: 'diamond@test.com',
    name: '다이아몬드 사용자',
    phone: '010-3333-4444',
    avatar: '/avatars/vip3.jpg',
    createdAt: '2021-09-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    password: 'password123',
    vipLevel: 'Diamond',
    vipMemberSince: '2021-09-01',
    totalSpent: 8500000,
    totalReservations: 65,
    averageRating: 4.9,
    favoriteRestaurants: 25,
    benefitsUsed: 20,
    points: 85000,
    tierProgress: {
      currentTier: 'Diamond',
      nextTier: 'Diamond',
      reservationsNeeded: 0,
      spendingNeeded: 0
    }
  } as VipUser,
  
  // 비즈니스 사용자 (restaurants.ts와 연결된 실제 식당들)
  {
    id: 'business_1',
    email: 'seokyonanmyunbang@eie.com',
    password: 'password123',
    name: '김낙영',
    phone: '0507-1487-0943',
    avatar: '/avatars/business1.jpg',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '서교난면방',
    businessType: 'restaurant',
    businessAddress: '서울특별시 마포구 동교로 12길, 16',
    businessPhone: '0507-1487-0943',
    businessLicense: '1234567890',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '1'
  } as BusinessUser,
  {
    id: 'business_2',
    email: 'woolaeoak@eie.com',
    password: 'password123',
    name: '우래옥',
    phone: '02-2265-0151',
    avatar: '/avatars/business2.jpg',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '우래옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 창경궁로 65-29',
    businessPhone: '02-2265-0151',
    businessLicense: '1234567891',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '2'
  } as BusinessUser,
  {
    id: 'business_3',
    email: 'buchonyukhoe@eie.com',
    password: 'password123',
    name: '부촌육회',
    phone: '02-2267-1831',
    avatar: '/avatars/business3.jpg',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '부촌육회',
    businessType: 'restaurant',
    businessAddress: '서울특별시 종로구 종로 200-12',
    businessPhone: '02-2267-1831',
    businessLicense: '1234567892',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '3'
  } as BusinessUser,
  {
    id: 'business_4',
    email: 'pildongmyeonok@eie.com',
    password: 'password123',
    name: '필동면옥',
    phone: '02-2266-2611',
    avatar: '/avatars/business4.jpg',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '필동면옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 서애로 26',
    businessPhone: '02-2266-2611',
    businessLicense: '1234567893',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '4'
  } as BusinessUser,
  {
    id: 'business_5',
    email: 'pyeongyangmyeonok@eie.com',
    password: 'password123',
    name: '평양면옥',
    phone: '02-2267-7784',
    avatar: '/avatars/business5.jpg',
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '평양면옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 장충단로 207',
    businessPhone: '02-2267-7784',
    businessLicense: '1234567894',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '5'
  } as BusinessUser,
  {
    id: 'business_6',
    email: 'hobin@eie.com',
    password: 'password123',
    name: '호빈',
    phone: '02-2270-3141',
    avatar: '/avatars/business6.jpg',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '호빈',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 동호로 287, 앰배서더 서울 풀만 2층',
    businessPhone: '02-2270-3141',
    businessLicense: '1234567895',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '6'
  } as BusinessUser,
  {
    id: 'business_7',
    email: 'niroumianguan@eie.com',
    password: 'password123',
    name: '진중 우육면관',
    phone: '0507-1376-2257',
    avatar: '/avatars/business7.jpg',
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '진중 우육면관 본점',
    businessType: 'restaurant',
    businessAddress: '서울특별시 종로구 청계천로 75-2',
    businessPhone: '0507-1376-2257',
    businessLicense: '1234567896',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '7'
  } as BusinessUser,
  {
    id: 'business_8',
    email: 'seouldining@eie.com',
    password: 'password123',
    name: '서울 다이닝',
    phone: '02-6325-6321',
    avatar: '/avatars/business8.jpg',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '서울 다이닝',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 동호로 272, 디자인하우스 2층',
    businessPhone: '02-6325-6321',
    businessLicense: '1234567897',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '8'
  } as BusinessUser,
  {
    id: 'business_9',
    email: 'hadongkwan@eie.com',
    password: 'password123',
    name: '하동관',
    phone: '02-776-5656',
    avatar: '/avatars/business9.jpg',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '하동관 명동 본점',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 명동 9길 12',
    businessPhone: '02-776-5656',
    businessLicense: '1234567898',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '9'
  } as BusinessUser,
  {
    id: 'business_10',
    email: 'myeongdonggyoja@eie.com',
    password: 'password123',
    name: '명동교자',
    phone: '0507-1366-5348',
    avatar: '/avatars/business10.jpg',
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-02-20T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '명동교자',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 명동 10길 29',
    businessPhone: '0507-1366-5348',
    businessLicense: '1234567899',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '10'
  } as BusinessUser,
  
  // 관리자
  {
    id: 'admin_001',
    email: 'admin@eie.com',
    name: 'EIE 관리자',
    phone: '02-9999-9999',
    avatar: '/avatars/admin1.jpg',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'admin',
    password: 'admin123'
  }
];

// 일반 사용자 데이터
export const regularUsers: User[] = [
  {
    id: 'user_001',
    email: 'kim.user@example.com',
    name: '김일반',
    phone: '010-1234-5678',
    avatar: '/avatars/user1.jpg',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'user'
  },
  {
    id: 'user_002',
    email: 'lee.user@example.com',
    name: '이일반',
    phone: '010-2345-6789',
    avatar: '/avatars/user2.jpg',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'user'
  },
  {
    id: 'user_003',
    email: 'park.user@example.com',
    name: '박일반',
    phone: '010-3456-7890',
    avatar: '/avatars/user3.jpg',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'user'
  }
];

// VIP 사용자 데이터
export const vipUsers: VipUser[] = [
  {
    id: 'vip_001',
    email: 'vip.gold@example.com',
    name: '골드김',
    phone: '010-1111-2222',
    avatar: '/avatars/vip1.jpg',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    vipLevel: 'Gold',
    vipMemberSince: '2023-06-15',
    totalSpent: 1200000,
    totalReservations: 15,
    averageRating: 4.5,
    favoriteRestaurants: 8,
    benefitsUsed: 3,
    points: 12000,
    tierProgress: {
      currentTier: 'Gold',
      nextTier: 'Platinum',
      reservationsNeeded: 10,
      spendingNeeded: 1800000
    }
  },
  {
    id: 'vip_002',
    email: 'vip.platinum@example.com',
    name: '플래티넘이',
    phone: '010-2222-3333',
    avatar: '/avatars/vip2.jpg',
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    vipLevel: 'Platinum',
    vipMemberSince: '2022-03-15',
    totalSpent: 3250000,
    totalReservations: 28,
    averageRating: 4.8,
    favoriteRestaurants: 12,
    benefitsUsed: 8,
    points: 32500,
    tierProgress: {
      currentTier: 'Platinum',
      nextTier: 'Diamond',
      reservationsNeeded: 22,
      spendingNeeded: 1750000
    }
  },
  {
    id: 'vip_003',
    email: 'vip.diamond@example.com',
    name: '다이아몬드박',
    phone: '010-3333-4444',
    avatar: '/avatars/vip3.jpg',
    createdAt: '2021-09-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'vip',
    vipLevel: 'Diamond',
    vipMemberSince: '2021-09-01',
    totalSpent: 8500000,
    totalReservations: 65,
    averageRating: 4.9,
    favoriteRestaurants: 25,
    benefitsUsed: 20,
    points: 85000,
    tierProgress: {
      currentTier: 'Diamond',
      nextTier: 'Diamond',
      reservationsNeeded: 0,
      spendingNeeded: 0
    }
  }
];

// 비즈니스 사용자 데이터
export const businessUsers: BusinessUser[] = [
  {
    id: 'business_1',
    email: 'seokyonanmyunbang@eie.com',
    password: 'password123',
    name: '김낙영',
    phone: '0507-1487-0943',
    avatar: '/avatars/business1.jpg',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '서교난면방',
    businessType: 'restaurant',
    businessAddress: '서울특별시 마포구 동교로 12길, 16',
    businessPhone: '0507-1487-0943',
    businessLicense: '1234567890',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '1' // restaurants.ts의 id와 연결
  },
  {
    id: 'business_2',
    email: 'woolaeoak@eie.com',
    password: 'password123',
    name: '우래옥',
    phone: '02-2265-0151',
    avatar: '/avatars/business2.jpg',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '우래옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 창경궁로 65-29',
    businessPhone: '02-2265-0151',
    businessLicense: '1234567891',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '2'
  },
  {
    id: 'business_3',
    email: 'buchonyukhoe@eie.com',
    password: 'password123',
    name: '부촌육회',
    phone: '02-2267-1831',
    avatar: '/avatars/business3.jpg',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '부촌육회',
    businessType: 'restaurant',
    businessAddress: '서울특별시 종로구 종로 200-12',
    businessPhone: '02-2267-1831',
    businessLicense: '1234567892',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '3'
  },
  {
    id: 'business_4',
    email: 'pildongmyeonok@eie.com',
    password: 'password123',
    name: '필동면옥',
    phone: '02-2266-2611',
    avatar: '/avatars/business4.jpg',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '필동면옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 서애로 26',
    businessPhone: '02-2266-2611',
    businessLicense: '1234567893',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '4'
  },
  {
    id: 'business_5',
    email: 'pyeongyangmyeonok@eie.com',
    password: 'password123',
    name: '평양면옥',
    phone: '02-2267-7784',
    avatar: '/avatars/business5.jpg',
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '평양면옥',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 장충단로 207',
    businessPhone: '02-2267-7784',
    businessLicense: '1234567894',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '5'
  },
  {
    id: 'business_6',
    email: 'hobin@eie.com',
    password: 'password123',
    name: '호빈',
    phone: '02-2270-3141',
    avatar: '/avatars/business6.jpg',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '호빈',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 동호로 287, 앰배서더 서울 풀만 2층',
    businessPhone: '02-2270-3141',
    businessLicense: '1234567895',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '6'
  },
  {
    id: 'business_7',
    email: 'niroumianguan@eie.com',
    password: 'password123',
    name: '진중 우육면관',
    phone: '0507-1376-2257',
    avatar: '/avatars/business7.jpg',
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '진중 우육면관 본점',
    businessType: 'restaurant',
    businessAddress: '서울특별시 종로구 청계천로 75-2',
    businessPhone: '0507-1376-2257',
    businessLicense: '1234567896',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '7'
  },
  {
    id: 'business_8',
    email: 'seouldining@eie.com',
    password: 'password123',
    name: '서울 다이닝',
    phone: '02-6325-6321',
    avatar: '/avatars/business8.jpg',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '서울 다이닝',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 동호로 272, 디자인하우스 2층',
    businessPhone: '02-6325-6321',
    businessLicense: '1234567897',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '8'
  },
  {
    id: 'business_9',
    email: 'hadongkwan@eie.com',
    password: 'password123',
    name: '하동관',
    phone: '02-776-5656',
    avatar: '/avatars/business9.jpg',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '하동관 명동 본점',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 명동 9길 12',
    businessPhone: '02-776-5656',
    businessLicense: '1234567898',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '9'
  },
  {
    id: 'business_10',
    email: 'myeongdonggyoja@eie.com',
    password: 'password123',
    name: '명동교자',
    phone: '0507-1366-5348',
    avatar: '/avatars/business10.jpg',
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-02-20T00:00:00.000Z',
    isActive: true,
    role: 'business',
    businessName: '명동교자',
    businessType: 'restaurant',
    businessAddress: '서울특별시 중구 명동 10길 29',
    businessPhone: '0507-1366-5348',
    businessLicense: '1234567899',
    isVerified: true,
    subscriptionPlan: 'premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59.000Z',
    restaurantId: '10'
  }
];

// 관리자 사용자 데이터
export const adminUsers: User[] = [
  {
    id: 'admin_001',
    email: 'admin@eie.com',
    name: 'EIE 관리자',
    phone: '02-9999-9999',
    avatar: '/avatars/admin1.jpg',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isActive: true,
    role: 'admin'
  }
];

// 모든 사용자 데이터 통합
export const allUsers: User[] = [
  ...regularUsers,
  ...vipUsers,
  ...businessUsers,
  ...adminUsers
];

// 회원가입 함수
export const registerUser = (userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'user' | 'vip' | 'business';
}): User => {
  // 이메일 중복 확인
  const existingUser = loginUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('이미 존재하는 이메일입니다.');
  }

  // 새 사용자 ID 생성
  const newUserId = `user_${Date.now()}`;
  
  // 기본 사용자 정보 생성
  const newUser: User = {
    id: newUserId,
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    avatar: `/avatars/default.jpg`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    role: userData.role,
    password: userData.password
  };

  // VIP 사용자인 경우 추가 정보 설정
  if (userData.role === 'vip') {
    const vipUser: VipUser = {
      ...newUser,
      role: 'vip',
      vipLevel: 'Gold',
      vipMemberSince: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      totalReservations: 0,
      averageRating: 0,
      favoriteRestaurants: 0,
      benefitsUsed: 0,
      points: 0,
      tierProgress: {
        currentTier: 'Gold',
        nextTier: 'Platinum',
        reservationsNeeded: 10,
        spendingNeeded: 1000000
      }
    };
    loginUsers.push(vipUser);
    return vipUser;
  }

  // 비즈니스 사용자인 경우 추가 정보 설정
  if (userData.role === 'business') {
    const businessUser: BusinessUser = {
      ...newUser,
      role: 'business',
      businessName: userData.name + ' 레스토랑',
      businessType: 'restaurant',
      businessAddress: '주소를 입력해주세요',
      businessPhone: userData.phone || '',
      businessLicense: '1234567890',
      isVerified: false,
      subscriptionPlan: 'basic',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    loginUsers.push(businessUser);
    return businessUser;
  }

  // 일반 사용자
  loginUsers.push(newUser);
  return newUser;
};

// 로그인 함수
export const loginUser = (email: string, password: string): User | null => {
  const user = loginUsers.find(user => 
    user.email === email && 
    user.password === password && 
    user.isActive
  );
  
  if (user) {
    // 비밀번호는 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};

// 로그인 가능한 계정 목록 (테스트용)
export const getLoginAccounts = () => {
  return loginUsers.map(user => ({
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role,
    vipLevel: (user as VipUser).vipLevel || null
  }));
};

// 사용자 검색 함수
export const findUserById = (id: string): User | undefined => {
  return allUsers.find(user => user.id === id);
};

export const findUserByEmail = (email: string): User | undefined => {
  return allUsers.find(user => user.email === email);
};

export const findVipUserById = (id: string): VipUser | undefined => {
  return vipUsers.find(user => user.id === id);
};

export const findBusinessUserById = (id: string): BusinessUser | undefined => {
  return businessUsers.find(user => user.id === id);
};

// 사용자 통계
export const userStats = {
  total: allUsers.length,
  regular: regularUsers.length,
  vip: vipUsers.length,
  business: businessUsers.length,
  admin: adminUsers.length,
  vipLevels: {
    gold: vipUsers.filter(user => user.vipLevel === 'Gold').length,
    platinum: vipUsers.filter(user => user.vipLevel === 'Platinum').length,
    diamond: vipUsers.filter(user => user.vipLevel === 'Diamond').length
  },
  businessTypes: {
    restaurant: businessUsers.filter(user => user.businessType === 'restaurant').length,
    cafe: businessUsers.filter(user => user.businessType === 'cafe').length,
    bar: businessUsers.filter(user => user.businessType === 'bar').length
  }
};

// VIP 등급별 혜택 정보
export const vipLevelBenefits = {
  Gold: {
    requirements: '연간 예약 10회 또는 누적 사용금액 100만원',
    benefits: ['우선 예약', '발레파킹 50% 할인', '생일 축하 메뉴'],
    color: 'yellow'
  },
  Platinum: {
    requirements: '연간 예약 25회 또는 누적 사용금액 300만원',
    benefits: ['무료 발레파킹', '전용 컨시어지', '특별 메뉴 제공', '우선 예약'],
    color: 'gray'
  },
  Diamond: {
    requirements: '연간 예약 50회 또는 누적 사용금액 500만원',
    benefits: ['모든 Platinum 혜택', '셰프 테이블 보장', '개인 매니저', 'VIP 전용 이벤트'],
    color: 'purple'
  }
};

// 비즈니스 구독 플랜 정보
export const businessSubscriptionPlans = {
  basic: {
    name: 'Basic',
    price: '월 50,000원',
    features: ['기본 예약 관리', '메뉴 등록', '리뷰 확인', '이메일 지원'],
    maxReservations: 100
  },
  premium: {
    name: 'Premium',
    price: '월 150,000원',
    features: ['모든 Basic 기능', '고급 분석', '마케팅 도구', '전화 지원', '우선 예약'],
    maxReservations: 500
  },
  enterprise: {
    name: 'Enterprise',
    price: '월 300,000원',
    features: ['모든 Premium 기능', '맞춤형 솔루션', '전담 매니저', 'API 접근', '무제한 예약'],
    maxReservations: -1 // 무제한
  }
}; 