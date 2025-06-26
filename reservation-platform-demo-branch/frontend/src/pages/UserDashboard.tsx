import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserReservations } from '../data/reservations';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import Header from '../components/Header';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    if (user) {
      const userReservations = getUserReservations(user.id);
      setReservations(userReservations);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '확정됨';
      case 'pending': return '대기중';
      case 'cancelled': return '취소됨';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">안녕하세요, {user.name}님!</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">일반 회원</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex">
              {[
                { id: 'reservations', label: '예약 내역', icon: Calendar },
                { id: 'favorites', label: '즐겨찾기', icon: Star },
                { id: 'settings', label: '설정', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'reservations' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">예약 내역</h3>
                {reservations.length > 0 ? (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{reservation.restaurantName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {new Date(reservation.date).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            {reservation.time}
                          </div>
                          <div className="flex items-center">
                            <Users size={16} className="mr-2" />
                            {reservation.guests}명
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            {reservation.restaurantName}
                          </div>
                        </div>
                        {reservation.specialRequest && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium">요청사항:</span> {reservation.specialRequest}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">아직 예약 내역이 없습니다.</p>
                    <p className="text-sm text-gray-500 mt-2">맛있는 레스토랑을 예약해보세요!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">즐겨찾기</h3>
                <div className="text-center py-8">
                  <Star size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">즐겨찾기한 레스토랑이 없습니다.</p>
                  <p className="text-sm text-gray-500 mt-2">마음에 드는 레스토랑을 즐겨찾기에 추가해보세요!</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">설정</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">알림 설정</h4>
                      <p className="text-sm text-gray-600">예약 관련 알림을 받습니다</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                      설정
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">개인정보 수정</h4>
                      <p className="text-sm text-gray-600">이름, 이메일 등 개인정보를 수정합니다</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                      수정
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;