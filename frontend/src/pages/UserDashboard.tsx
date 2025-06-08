import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Settings, Star, Calendar, Heart, User } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      setError('');
      fetch(`/api/reservations/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setReservations(data);
        })
        .catch(() => setError('예약 내역을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const mockReviews = [
    {
      id: '1',
      restaurant: '서교난면방',
      rating: 4.5,
      content: '맛있었습니다. 특히 난면이 쫄깃했어요.',
      date: '2025-03-15'
    }
  ];

  const mockFavorites = [
    {
      id: '1',
      name: '서교난면방',
      type: '중식',
      rating: 4.5
    },
    {
      id: '2',
      name: '우에록',
      type: '일식',
      rating: 4.8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-red-600 mt-1">내 정보 관리</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <User size={32} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-600">예약 {user?.reservationCount}회</p>
                  <span className="text-sm font-medium text-red-600">
                    {user?.isVip ? 'VIP 회원' : '일반 회원'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex border-b">
                  <TabsTrigger
                    value="reservations"
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'reservations'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Calendar size={16} className="inline-block mr-2" />
                    예약 내역
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'reviews'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Star size={16} className="inline-block mr-2" />
                    리뷰 관리
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'favorites'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Heart size={16} className="inline-block mr-2" />
                    관심 목록
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'settings'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Settings size={16} className="inline-block mr-2" />
                    설정
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reservations" className="p-6">
                  {loading ? (
                    <div>로딩 중...</div>
                  ) : error ? (
                    <div className="text-red-600">{error}</div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <div key={reservation.reservation_id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{reservation.restaurant_id}</h3>
                              <p className="text-sm text-gray-600">
                                {reservation.reservation_time}
                              </p>
                              <p className="text-sm text-gray-600">
                                {reservation.guest_count}명
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              reservation.status === '확정'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{review.restaurant}</h3>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400" />
                            <span className="ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{review.content}</p>
                        <p className="text-gray-500 text-sm">{review.date}</p>
                        <div className="mt-2 space-x-2">
                          <button className="text-sm text-blue-600 hover:underline">
                            수정
                          </button>
                          <button className="text-sm text-red-600 hover:underline">
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockFavorites.map((favorite) => (
                      <div key={favorite.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{favorite.name}</h3>
                            <p className="text-sm text-gray-600">{favorite.type}</p>
                          </div>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400" />
                            <span className="ml-1">{favorite.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">계정 설정</h3>
                      <div className="space-y-4">
                        <button
                          onClick={() => window.location.href = '/profile'}
                          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <User size={20} className="text-gray-600 mr-3" />
                            <span>회원 정보 수정</span>
                          </div>
                          <span className="text-gray-400">→</span>
                        </button>
                        <button
                          onClick={() => window.location.href = '/notifications'}
                          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <Settings size={20} className="text-gray-600 mr-3" />
                            <span>알림 설정</span>
                          </div>
                          <span className="text-gray-400">→</span>
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">계정 관리</h3>
                      <button
                        onClick={logout}
                        className="w-full p-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;