import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Search, Calendar, MapPin, Phone, Clock, X } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';

const categories = [
  'VIP 프로모션',
  '조식 또는 중식',
  'G.A.O.',
  '라운지 체험',
  '카바나',
  '석인 원',
  '디너',
  '룸서비스',
  '인 샵핑',
  '키즈',
  '와이너리',
  '아와 수영장',
  '2인 이상 상품'
];

const promotions = [
  {
    id: 1,
    title: 'Rewards Secret Urban Promotion',
    image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg',
    period: '2025-04-07 ~ 2025-05-29',
    description: '어번 이월렌드 All Day 입장 + 카바나 K1~4 중 1동 이용',
    tag: 'VIP 프로모션',
    details: {
      benefits: ['더 이그제큐티브 라운지 혜택', '어번 이월렌드 All Day 입장 혜택', '체련장(Gym), 실내 수영장 혜택'],
      location: '서울특별시 강남구 테헤란로 123',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-1234-5678'
    }
  },
  {
    id: 2,
    title: 'Rewards Mixology Selection',
    image: 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg',
    period: '2025-05-13 ~ 2025-07-31',
    description: '[5월 25일까지 예약 가능] Mixology Kit + 객실 미니바 구성 이용 + 어번 이월렌드 All Day 입장 + 호텔 크레딧 10만원',
    price: '473,000',
    tag: '라운지 체험',
    details: {
      benefits: ['Mixology Kit 제공', '객실 미니바 무료 이용', '어번 이월렌드 All Day 입장'],
      location: '서울특별시 강남구 테헤란로 456',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-2345-6789'
    }
  },
  {
    id: 3,
    title: '[App 전용] Rewards App Lounge Special',
    image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg',
    period: '2025-04-11 ~ 2025-06-30',
    description: '라운즈 런치 + 더 이그제큐티브 라운지 입장 + 어번 이월렌드 All Day 입장',
    price: '511,500',
    tag: '룸서비스',
    details: {
      benefits: ['라운지 런치 제공', '더 이그제큐티브 라운지 입장', '어번 이월렌드 All Day 입장'],
      location: '서울특별시 강남구 테헤란로 789',
      hours: '체크인 15:00 / 체크아웃 11:00',
      contact: '02-3456-7890'
    }
  }
];

const ConciergeServices: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Concierge Services</h1>
          <p className="text-red-600 mt-1">VIP 회원을 위한 특별한 서비스</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full border-b border-gray-300 focus:border-red-500 outline-none py-2"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategories.includes(category)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promotion => (
            <div key={promotion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                  {promotion.tag}
                </span>
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
                <button 
                  onClick={() => openDetailModal(promotion)}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

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
                src={selectedPromotion.image}
                alt={selectedPromotion.title}
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

              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsReservationModalOpen(true);
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors mt-6"
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isReservationModalOpen && selectedPromotion && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          restaurantName={selectedPromotion.title}
        />
      )}
    </div>
  );
};

export default ConciergeServices;