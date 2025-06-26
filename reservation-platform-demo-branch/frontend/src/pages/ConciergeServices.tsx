import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { X, Calendar, MapPin, Clock, Phone, Search } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';

const categories = [
  '식당 페어링/셰프/다이닝',
  '호텔 프리미엄',
  '전용 차량 서비스',
  '카드사 전용 혜택'
];

const promotions = [
  // 식당 페어링/셰프/다이닝
  {
    id: 1,
    title: '🎉 Signature Dining Week',
    image: '',
    period: '2025-07-01 ~ 2025-07-07',
    description: '미쉐린 가이드 선정 레스토랑에서만 경험할 수 있는 단 1주간의 프라이빗 다이닝 페스티벌. 한정 좌석, 특별 셰프 테이블, 와인 페어링 등 오직 EIE 회원만을 위한 혜택을 누리세요.',
    tag: '식당 페어링/셰프/다이닝',
    price: '350,000',
    details: {
      benefits: [
        '미쉐린 레스토랑 최대 20% 특별 할인',
        '셰프 시그니처 코스 및 한정 좌석 우선 예약',
        '소믈리에 추천 와인 페어링',
        'EIE 회원 전용 웰컴 기프트',
        '런칭 기념 스페셜 디저트 제공'
      ],
      location: '서울 강남구 미쉐린 레스토랑',
      hours: '19:00 ~ 22:00',
      contact: '02-0000-0000'
    }
  },
  {
    id: 2,
    title: '💎 Concierge Black Invitation',
    image: '',
    period: '분기별',
    description: '누적 결제 100만원 이상 VIP 고객만을 위한 초청형 프라이빗 다이닝. 셰프와의 1:1 미팅, 맞춤형 메뉴 컨설팅, 프리미엄 와인 셀렉션 등 최상위 컨시어지 경험을 제공합니다.',
    tag: '식당 페어링/셰프/다이닝',
    price: '1,800,000',
    details: {
      benefits: [
        'VIP 전용 프라이빗 다이닝룸',
        '셰프와의 1:1 미팅 및 메뉴 컨설팅',
        '프리미엄 와인 셀렉션',
        '전담 컨시어지 매니저 배정',
        '기념일 맞춤 플라워/테이블 세팅'
      ],
      location: '서울 종로구 미쉐린 레스토랑',
      hours: '18:00 ~ 21:00',
      contact: '02-5555-6666'
    }
  },
  {
    id: 3,
    title: '📸 SNS 인증 리워드 이벤트',
    image: '',
    period: '2025-06-15 ~ 2025-07-15',
    description: 'EIE에서 예약 후 인스타그램 인증샷을 올리면, 추가 메뉴 또는 와인 1잔을 무료로 제공합니다. MZ세대 고객을 위한 트렌디한 미식 경험과 리워드를 동시에!',
    tag: '식당 페어링/셰프/다이닝',
    price: '180,000',
    details: {
      benefits: [
        'SNS 인증 시 추가 메뉴 또는 와인 1잔 무료',
        '트렌디한 플레이팅 및 포토존 제공',
        '셰프와의 포토타임',
        '이벤트 해시태그 참여 시 추첨 경품',
        'MZ세대 맞춤 메뉴'
      ],
      location: '서울 중구 프리미엄 다이닝',
      hours: '18:00 ~ 21:00',
      contact: '02-1111-2222'
    }
  },
  {
    id: 4,
    title: '🔁 리턴 고객 감사 프로모션',
    image: '',
    period: '상시',
    description: '최근 3개월 내 EIE를 통해 예약하신 고객님께 재방문 감사 할인과 맞춤형 서비스 혜택을 드립니다. 프리미엄 다이닝의 감동을 다시 한 번 경험하세요.',
    tag: '식당 페어링/셰프/다이닝',
    price: '280,000',
    details: {
      benefits: [
        '재방문 고객 15% 할인 쿠폰',
        '고객 취향 기반 맞춤 메뉴 추천',
        '와인 페어링 3종 무료 업그레이드',
        '기념일 특별 서비스',
        'VIP 멤버십 포인트 2배 적립'
      ],
      location: '서울/수도권 주요 레스토랑',
      hours: '상시',
      contact: '02-9999-8888'
    }
  },
  {
    id: 5,
    title: '🍷 호텔+다이닝 프리미엄 패키지',
    image: '',
    period: '상시',
    description: '제휴 5성급 호텔 투숙 시, 미쉐린 레스토랑 예약 및 조식, 라운지 이용까지 포함된 올인원 프리미엄 패키지. 특별한 날, 품격 있는 미식과 휴식을 동시에 누리세요.',
    tag: '식당 페어링/셰프/다이닝',
    price: '650,000',
    details: {
      benefits: [
        '5성급 호텔 1박 숙박',
        '미쉐린 레스토랑 디너 예약',
        '조식 뷔페 및 전용 라운지 이용',
        '레스토랑 우선 예약권',
        '웰컴 기프트 제공'
      ],
      location: '서울 강남구 5성급 호텔',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-3333-4444'
    }
  },
  // 호텔 프리미엄
  {
    id: 6,
    title: 'Signature Dining Stay',
    image: '',
    period: '상시',
    description: '기념일, 프로포즈 등 특별한 날을 위한 1박 숙박과 미쉐린 레스토랑 디너, 와인 페어링, 전용 차량 의전까지 포함된 프리미엄 스테이 패키지.',
    tag: '호텔 프리미엄',
    price: '1,200,000',
    details: {
      benefits: [
        '스위트룸 1박 숙박',
        '미쉐린 레스토랑 디너 예약',
        '소믈리에 추천 와인 페어링',
        '전용 차량 픽업/샌딩',
        '기념일 테이블 세팅 및 미니 케이크'
      ],
      location: '서울 주요 5성급 호텔',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-9999-8888'
    }
  },
  {
    id: 7,
    title: 'Executive 접대 패키지',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    period: '상시',
    description: '대기업 임원, VIP 파트너를 위한 스위트룸 + 프리미엄 레스토랑 + 비즈니스 차량 + 맞춤 좌석 세팅',
    tag: '호텔 프리미엄',
    price: '1,800,000',
    details: {
      benefits: [
        '스위트룸 1박',
        '프리미엄 레스토랑 예약',
        '비즈니스 차량 의전',
        '맞춤 좌석 세팅',
        '웰컴 기프트'
      ],
      location: '서울 강남구 5성급 호텔',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-8888-7777'
    }
  },
  {
    id: 8,
    title: 'Gourmet & Getaway',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    period: '주말/휴가 시즌',
    description: '트렌디한 미쉐린 레스토랑 + 감각적 숙박, MZ세대/커플 인기 패키지',
    tag: '호텔 프리미엄',
    price: '750,000',
    details: {
      benefits: [
        '트렌디 레스토랑 예약',
        '디자이너 호텔 숙박',
        '조식 포함',
        'SNS 인증 이벤트'
      ],
      location: '서울/부산 주요 호텔',
      hours: '체크인 16:00 / 체크아웃 12:00',
      contact: '02-7777-6666'
    }
  },
  {
    id: 9,
    title: 'Family Fine Dining',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    period: '상시',
    description: '프라이빗 룸 제공 고급 레스토랑 + 가족 전용 패밀리룸/연결 객실',
    tag: '호텔 프리미엄',
    price: '980,000',
    details: {
      benefits: [
        '프라이빗 다이닝룸',
        '패밀리룸/연결 객실',
        '어린이 웰컴키트',
        '가족 기념일 세팅'
      ],
      location: '서울/수도권 주요 호텔',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-5555-4444'
    }
  },
  {
    id: 10,
    title: 'Late Night Dining & Stay',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a',
    period: '상시',
    description: '퇴근 후 고급 외식 + 심야 체크인 스테이, 바쁜 직장인 특화',
    tag: '호텔 프리미엄',
    price: '690,000',
    details: {
      benefits: [
        '심야 체크인',
        '고급 레스토랑 저녁',
        '조용한 객실',
        '야간 룸서비스'
      ],
      location: '서울 도심 호텔',
      hours: '체크인 21:00 / 체크아웃 11:00',
      contact: '02-4444-3333'
    }
  },
  {
    id: 11,
    title: 'Wine & Rest',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    period: '상시',
    description: '고급 와인 페어링 + 룸서비스 중심, 와인 애호가/휴식 고객용',
    tag: '호텔 프리미엄',
    price: '820,000',
    details: {
      benefits: [
        '와인 페어링',
        '룸서비스 디너',
        '웰니스 프로그램',
        '조용한 객실'
      ],
      location: '서울/수도권 주요 호텔',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-2222-1111'
    }
  },
  {
    id: 12,
    title: 'Premium Concierge 컬렉션',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    period: '상시',
    description: '프라이빗 외식 매니저가 맞춤 대응, 예약~픽업까지 풀 컨시어지 상시 지원',
    tag: '호텔 프리미엄',
    price: '1,500,000',
    details: {
      benefits: [
        '외식 매니저 1:1 매칭',
        '맞춤 좌석/메뉴/알레르기 대응',
        '예약~픽업 풀서비스',
        '웰컴키트/기념일 세팅'
      ],
      location: '서울/수도권 주요 호텔',
      hours: '상시',
      contact: '02-1111-0000'
    }
  },
  // 전용 차량 서비스
  {
    id: 101,
    title: 'Signature Dining Pickup',
    image: '',
    period: '상시',
    description: '미쉐린 레스토랑 디너 고객을 위한 왕복 전용차량 서비스. 기사 복장 매뉴얼, 웰컴 드링크, 차량 내 와인 옵션 등 프리미엄 의전 경험을 제공합니다.',
    tag: '전용 차량 서비스',
    price: '별도 문의',
    details: {
      benefits: [
        '왕복 전용차량(고급 세단/리무진)',
        '차량 내 와인/음료 옵션',
        '기사 복장 및 매너 매뉴얼',
        '웰컴 드링크/간식 제공',
        '레스토랑 메뉴북 제공'
      ],
      location: '서울/수도권',
      hours: '예약 시 협의',
      contact: '02-7777-8888'
    }
  },
  {
    id: 102,
    title: 'Executive 접대 차량 패키지',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    period: '상시',
    description: '기업 접대용 블랙카/벤츠 E·S클래스, 기사 배정, 정시 도착 보장',
    tag: '전용 차량 서비스',
    price: '별도 문의',
    details: {
      benefits: [
        '블랙카/벤츠 E·S클래스',
        '전담 기사 배정',
        '정시 도착 보장',
        '비즈니스 맞춤 동선',
        '기업명 쿠폰/정기 운송 협의'
      ],
      location: '서울/수도권',
      hours: '예약 시 협의',
      contact: '02-7777-8888'
    }
  },
  {
    id: 103,
    title: 'Gourmet 데이트 셔틀',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    period: '상시',
    description: '커플 대상 트렌디 레스토랑 저녁 셔틀, 2시간 대기 포함',
    tag: '전용 차량 서비스',
    price: '별도 문의',
    details: {
      benefits: [
        '커플 전용 프리미엄 차량',
        '2시간 대기 포함',
        '기념일 꽃다발/와인 옵션',
        '차량 내 BGM/디퓨저'
      ],
      location: '서울/수도권',
      hours: '예약 시 협의',
      contact: '02-7777-8888'
    }
  },
  {
    id: 104,
    title: 'Family 셔틀',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    period: '상시',
    description: '2~3세대 가족 전용 대형 밴/패밀리카, 카시트 옵션',
    tag: '전용 차량 서비스',
    price: '별도 문의',
    details: {
      benefits: [
        '대형 밴/패밀리카',
        '카시트 옵션',
        '가족 기념일 세팅',
        '웰컴키트 제공'
      ],
      location: '서울/수도권',
      hours: '예약 시 협의',
      contact: '02-7777-8888'
    }
  },
  {
    id: 105,
    title: 'Late Night Safe Return',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a',
    period: '상시',
    description: '야간 외식 후 심야 귀가, 여성/1인 고객 안전 귀가 특화',
    tag: '전용 차량 서비스',
    price: '별도 문의',
    details: {
      benefits: [
        '심야 귀가 전용차량',
        '여성/1인 고객 안전 서비스',
        '기사 매너 가이드',
        '차량 내 BGM/디퓨저'
      ],
      location: '서울/수도권',
      hours: '예약 시 협의',
      contact: '02-7777-8888'
    }
  },
  // 카드사 전용 혜택
  {
    id: 13,
    title: 'Signature Dining Package (플래티넘 이상)',
    image: '',
    period: '상시',
    description: '플래티넘 등급 이상 회원을 위한 미쉐린 레스토랑 전용 예약, 와인 페어링, 기념일 꽃다발 등 프라이빗 혜택을 제공합니다.',
    tag: '카드사 전용 혜택',
    price: '별도 문의',
    details: {
      benefits: [
        '미쉐린 레스토랑 예약 대행',
        '와인 페어링 코스',
        '기념일 꽃다발/메시지 카드',
        '호텔/차량 옵션 연동',
        '카드사 전용 예약 창구'
      ],
      location: '서울/수도권 주요 레스토랑',
      hours: '상시',
      contact: '카드사 전용 콜센터'
    }
  },
  {
    id: 14,
    title: 'Executive Business Dining (블랙/인피니트)',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    period: '상시',
    description: 'VIP/외국인 응대용 고급 레스토랑 큐레이션, 알레르기/좌석 맞춤, 차량/통역 연계',
    tag: '카드사 전용 혜택',
    price: '별도 문의',
    details: {
      benefits: [
        '고급 레스토랑 사전 큐레이션',
        '고객 맞춤 좌석/알레르기 대응',
        '비즈니스 차량/통역 연계',
        '카드사 전용 상담'
      ],
      location: '서울/수도권 프리미엄 다이닝',
      hours: '상시',
      contact: '카드사 전용 콜센터'
    }
  },
  {
    id: 15,
    title: 'Hidden Gem Collection (프라이빗 뱅킹)',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    period: '시즌별',
    description: '예약 불가 매장 리스트 선공개, 소수 고객 대상 시크릿 다이닝 초청',
    tag: '카드사 전용 혜택',
    price: '초청 전용',
    details: {
      benefits: [
        '예약 불가 매장 우선 공개',
        '시크릿 다이닝 초청',
        '프라이빗 뱅킹 고객 한정'
      ],
      location: '서울/수도권 시크릿 레스토랑',
      hours: '초청 일정별',
      contact: '카드사 전용 콜센터'
    }
  },
  {
    id: 16,
    title: 'Monthly Dining Picks (전 고객)',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    period: '매월',
    description: '매월 고급 식당 3곳 추천, 한정 수량 사전 예약, FOMO 심리 유도',
    tag: '카드사 전용 혜택',
    price: '별도 문의',
    details: {
      benefits: [
        '월별 추천 레스토랑',
        '한정 수량 사전 예약',
        '생일 주간 무료 와인',
        '카드사 전용 우선권'
      ],
      location: '서울/수도권 주요 레스토랑',
      hours: '매월',
      contact: '카드사 전용 콜센터'
    }
  }
];

const categoryImages: Record<string, string> = {
  '식당 페어링/셰프/다이닝': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  '호텔 프리미엄': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  '전용 차량 서비스': 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e',
  '카드사 전용 혜택': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
};

const getPromotionImage = (promotion: { image?: string; tag: string }) => {
  // image가 없거나 깨질 경우 카테고리 대표 이미지 사용
  return promotion.image || categoryImages[promotion.tag] || categoryImages['default'];
};

const ConciergeServices: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'popularity' | 'newest'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const navigate = useNavigate();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const openDetailModal = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsDetailModalOpen(true);
  };

  const handleReservationClick = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsReservationModalOpen(true);
    setRestaurantName(promotion.title || '');
  };

  const filteredPromotions = promotions
    .filter(p =>
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || selectedCategories.includes(p.tag)) &&
      (p.price === '별도 문의' || 
        (parseInt(p.price.replace(/,/g, '')) >= priceRange[0] &&
         parseInt(p.price.replace(/,/g, '')) <= priceRange[1]))
    )
    .sort((a, b) => {
      if (sortBy === 'price') {
        if (a.price === '별도 문의') return 1;
        if (b.price === '별도 문의') return -1;
        return parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''));
      }
      if (sortBy === 'popularity') {
        return b.id - a.id; // 임시로 id로 정렬
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Concierge Services</h1>
          <p className="text-red-600 mt-1">VIP 회원을 위한 특별한 서비스</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full border-b border-gray-300 focus:border-red-500 outline-none py-2"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="newest">최신순</option>
                <option value="price">가격순</option>
                <option value="popularity">인기순</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">가격 범위:</span>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">
                  {priceRange[0].toLocaleString()}원 ~ {priceRange[1].toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리별 섹션 렌더링 */}
        {categories.map(category => {
          const sectionPromotions = filteredPromotions.filter(promotion => promotion.tag === category);
          return (
            <section key={category} className="mb-12">
              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <h2 className="mx-4 text-2xl font-bold text-gray-800 whitespace-nowrap">{category}</h2>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionPromotions.length > 0 ? sectionPromotions.map(promotion => (
                  <div 
                    key={promotion.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="relative h-48">
                      <img
                        src={getPromotionImage(promotion)}
                        alt={promotion.title}
                        onError={e => { e.currentTarget.src = categoryImages['default']; }}
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                        {promotion.tag}
                      </span>
                      {promotion.period !== '상시' && (
                        <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                          {promotion.period}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{promotion.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{promotion.period}</p>
                      <p className="text-sm text-gray-700 mb-4">{promotion.description}</p>
                      {promotion.price && (
                        <p className="text-lg font-bold text-red-600 mb-4">
                          {promotion.price}원 ~
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openDetailModal(promotion)}
                          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          상세보기
                        </button>
                        <button 
                          onClick={() => handleReservationClick(promotion)}
                          className="flex-1 bg-white border border-red-600 text-red-600 py-2 rounded hover:bg-red-50 transition-colors"
                        >
                          예약하기
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    해당 카테고리의 서비스가 없습니다.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <img
                src={getPromotionImage(selectedPromotion)}
                alt={selectedPromotion.title}
                onError={e => { e.currentTarget.src = categoryImages['default']; }}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">{selectedPromotion.title}</h2>
            <p className="text-red-600 mb-4">{selectedPromotion.tag}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">기간</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <p>{selectedPromotion.period}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">혜택 안내</h3>
                <ul className="space-y-2">
                  {selectedPromotion.details.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">위치</h3>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <p>{selectedPromotion.details.location}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">이용 시간</h3>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <p>{selectedPromotion.details.hours}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">문의</h3>
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-2" />
                  <p>{selectedPromotion.details.contact}</p>
                </div>
              </div>

              {selectedPromotion.price && (
                <div>
                  <h3 className="font-medium text-lg mb-2">가격</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedPromotion.price}원 ~
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleReservationClick(selectedPromotion)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  예약하기
                </button>
                <button
                  onClick={() => {
                    // SNS 공유 기능 추가 예정
                    alert('SNS 공유 기능이 곧 추가될 예정입니다.');
                  }}
                  className="flex-1 bg-white border border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors"
                >
                  공유하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReservationModalOpen && selectedPromotion && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          restaurantName={restaurantName}
        />
      )}
      
    </div>
  );
};

export default ConciergeServices;