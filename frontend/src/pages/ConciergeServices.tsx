import React, { useState } from 'react';
import Header from '../components/Header';
import { Search } from 'lucide-react';

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
    tag: 'VIP 프로모션'
  },
  {
    id: 2,
    title: 'Rewards Mixology Selection',
    image: 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg',
    period: '2025-05-13 ~ 2025-07-31',
    description: '[5월 25일까지 예약 가능] Mixology Kit + 객실 미니바 구성 이용 + 어번 이월렌드 All Day 입장 + 호텔 크레딧 10만원',
    price: '473,000',
    tag: '라운지 체험'
  },
  {
    id: 3,
    title: '[App 전용] Rewards App Lounge Special',
    image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg',
    period: '2025-04-11 ~ 2025-06-30',
    description: '라운즈 런치 + 더 이그제큐티브 라운지 입장 + 어번 이월렌드 All Day 입장',
    price: '511,500',
    tag: '룸서비스'
  }
];

const ConciergeServices: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
                  <p className="text-lg font-bold text-red-600">
                    {promotion.price}원 ~
                  </p>
                )}
                <button className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
                  예약하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ConciergeServices;