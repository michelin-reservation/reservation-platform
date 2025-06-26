import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Phone, MapPin, Instagram } from 'lucide-react';
import Header from '../components/Header';
import MapComponent from '../components/MapComponent';
import Gallery from '../components/Gallery';
import ReservationModal from '../components/ReservationModal';
import { Restaurant } from '../types';
import { restaurants } from '../data/restaurants';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      // 먼저 로컬 데이터에서 레스토랑 찾기
      const localRestaurant = restaurants.find(r => r.id === id);
      
      if (localRestaurant) {
        setRestaurant(localRestaurant);
        if (localRestaurant.nameKorean) {
          document.title = `${localRestaurant.nameKorean} | EIE`;
        }
      } else {
        // 로컬에 없으면 API에서 가져오기 (fallback)
        fetch(`/api/restaurants/${id}`)
          .then(res => res.json())
          .then(data => {
            setRestaurant(data);
            if (data && data.nameKorean) {
              document.title = `${data.nameKorean} | EIE`;
            }
          })
          .catch(() => setRestaurant(null));
      }
    }
    return () => {
      document.title = 'EIE';
    };
  }, [id]);
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">레스토랑을 찾을 수 없습니다</h1>
          <Link to="/" className="text-red-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.nameKorean || restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          {restaurant.category && (
            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-3">
              {restaurant.category}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold">{restaurant.nameKorean || restaurant.name}</h1>
          <p className="mt-2 text-sm md:text-base opacity-90">{restaurant.address}</p>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeft size={16} className="mr-1" />
            <span>이전</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { id: 'info', label: '상세 정보' },
                { id: 'menu', label: '메뉴' },
                { id: 'photos', label: '갤러리' },
                { id: 'map', label: '위치' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                <h2 className="text-xl font-bold mb-4">레스토랑 소개</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  {restaurant.description || '정보가 준비 중입니다.'}
                </p>
                
                {restaurant.openingHours && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">영업시간</h3>
                    <div className="flex items-start">
                      <Clock size={18} className="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-gray-700">{restaurant.openingHours.regular}</p>
                        {restaurant.openingHours.dayOff && (
                          <p className="text-gray-600 text-sm mt-1">{restaurant.openingHours.dayOff}</p>
                        )}
                        {restaurant.openingHours.breakTime && (
                          <p className="text-gray-600 text-sm mt-1">{restaurant.openingHours.breakTime}</p>
                        )}
                        {restaurant.openingHours.lastOrder && (
                          <p className="text-gray-600 text-sm mt-1">{restaurant.openingHours.lastOrder}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {restaurant.services && restaurant.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">편의 서비스</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.services.map((service, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {restaurant.phone && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">전화번호</h3>
                    <div className="flex items-center">
                      <Phone size={18} className="text-gray-500 mr-2" />
                      <a href={`tel:${restaurant.phone}`} className="text-gray-700 hover:text-red-600">
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {restaurant.social && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">관련 링크</h3>
                    <div className="space-y-2">
                      {restaurant.social.instagram && (
                        <a href={restaurant.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-700 hover:text-red-600">
                          <Instagram size={18} className="mr-2" />
                          <span>Instagram</span>
                        </a>
                      )}
                      {restaurant.social.webpage && (
                        <a href={restaurant.social.webpage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-700 hover:text-red-600 block">
                          <span>공식 웹사이트</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {restaurant.michelinGuide && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">미쉐린 가이드</h3>
                    <p className="text-gray-700">{restaurant.michelinGuide}</p>
                  </div>
                )}
                
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.tags.map((tag, index) => (
                        <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'menu' && (
              <div>
                <h2 className="text-xl font-bold mb-6">메뉴</h2>
                {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurant.menuItems.map((item, index) => (
                      <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-700">{item.price}원</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">메뉴 정보가 준비 중입니다.</p>
                )}
              </div>
            )}
            
            {activeTab === 'photos' && (
              <div>
                <h2 className="text-xl font-bold mb-6">갤러리</h2>
                {restaurant.galleryImages && restaurant.galleryImages.length > 0 ? (
                  <Gallery images={restaurant.galleryImages} />
                ) : restaurant.image ? (
                  <div className="text-center py-8">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.nameKorean || restaurant.name}
                      className="max-w-md mx-auto rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-700 mb-4">사진이 준비 중입니다.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'map' && (
              <div>
                <h2 className="text-xl font-bold mb-6">위치</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{restaurant.address}</span>
                  </div>
                </div>
                {restaurant.lat && restaurant.lng && (
                  <MapComponent 
                    restaurants={[restaurant]} 
                    selectedId={restaurant.id}
                    height="400px"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsReservationModalOpen(true)}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            예약하기
          </button>
        </div>
      </main>
      
      {isReservationModalOpen && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          restaurantName={restaurant.nameKorean || restaurant.name}
          restaurantId={restaurant.id}
        />
      )}
    </div>
  );
};

export default RestaurantPage;