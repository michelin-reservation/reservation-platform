import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Phone, MapPin, Instagram } from 'lucide-react';
import Header from '../components/Header';
import MapComponent from '../components/MapComponent';
import Gallery from '../components/Gallery';
import ReservationModal from '../components/ReservationModal';
import { Restaurant } from '../types';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      setRestaurant(null);
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
    return () => {
      document.title = 'EIE';
    };
  }, [id]);
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <Link to="/" className="text-red-600 hover:underline">
            Return to home page
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
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          {restaurant.category === '미쉐린 빕구르망' && (
            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-3">
              미쉐린 빌구르망
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold">{restaurant.nameKorean}</h1>
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
                    <p className="text-gray-700">{restaurant.services.join(', ')}</p>
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
                
                {restaurant.social?.instagram && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">관련 링크</h3>
                    <a href={restaurant.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-700 hover:text-red-600">
                      <Instagram size={18} className="mr-2" />
                      <span>Instagram</span>
                    </a>
                  </div>
                )}
                
                {restaurant.ranking && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">전년 취석 수</h3>
                    <p className="text-gray-700">
                      12/20 (4인석 테이블 1/2, 2인석 테이블 4/6)
                    </p>
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
                        <span className="text-gray-700">{item.price.toLocaleString()}원</span>
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
                ) : (
                  <p className="text-gray-700">사진이 준비 중입니다.</p>
                )}
              </div>
            )}
            
            {activeTab === 'map' && (
              <div>
                <h2 className="text-xl font-bold mb-6">위치</h2>
                <div className="mb-4">
                  <div className="flex items-start mb-3">
                    <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{restaurant.address}</p>
                  </div>
                </div>
                <MapComponent 
                  restaurants={[restaurant]} 
                  selectedId={restaurant.id}
                  height="400px"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">리뷰</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                리뷰 작성하기
              </button>
              <p className="text-gray-600 text-sm mt-2">
                레스토랑에 대한 경험을 공유해주세요
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex justify-between">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeft size={16} className="mr-1" />
            <span>이전</span>
          </Link>
          <button 
            onClick={() => setIsReservationModalOpen(true)}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            <span>예약하기</span>
          </button>
        </div>
      </main>

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        restaurantName={restaurant.nameKorean}
      />
    </div>
  );
};

export default RestaurantPage;