import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { restaurants } from '../data/restaurants';
import { reservations } from '../data/reservations';
import Header from '../components/Header';
import { Calendar, Users, TrendingUp, Clock, MapPin, Phone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [restaurantReservations, setRestaurantReservations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    monthlyRevenue: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user && user.type === 'business') {
      // business 사용자의 restaurantId를 통해 해당 식당 정보 찾기
      const businessUser = user as any;
      const restaurantId = businessUser.restaurantId;
      
      if (restaurantId) {
        const foundRestaurant = restaurants.find(r => r.id === restaurantId);
        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
          
          // 해당 식당의 예약 내역 필터링
          const filteredReservations = reservations.filter(
            res => res.restaurantId === restaurantId
          );
          setRestaurantReservations(filteredReservations);
          
          // 통계 계산
          const today = new Date().toISOString().split('T')[0];
          const todayReservations = filteredReservations.filter(
            res => res.date === today
          ).length;
          
          const monthlyRevenue = filteredReservations.reduce((sum, res) => {
            const amount = typeof res.totalAmount === 'string' ? parseInt(res.totalAmount) : (res.totalAmount || 0);
            return sum + amount;
          }, 0);
          
          setStats({
            totalReservations: filteredReservations.length,
            todayReservations,
            monthlyRevenue,
            averageRating: 4.5 // 임시 평점
          });
        }
      }
    }
  }, [user]);

  if (!user || user.type !== 'business') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              접근 권한이 없습니다
            </h1>
            <p className="text-gray-600">
              사업자 계정으로 로그인해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              식당 정보를 찾을 수 없습니다
            </h1>
            <p className="text-gray-600">
              관리자에게 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.nameKorean || restaurant.name} 대시보드
            </h1>
            <p className="text-gray-600">
              {restaurant.address}
            </p>
          </div>
          <Link
            to="/business/business-settings"
            className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-red-600 hover:text-white font-medium transition-colors"
          >
            설정
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예약</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오늘 예약</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayReservations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">월 매출</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyRevenue.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 평점</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 식당 정보 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">식당 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{restaurant.address}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{restaurant.phone}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">
                    {restaurant.openingHours?.regular || '영업시간 정보 없음'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">카테고리</p>
                <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  {restaurant.category}
                </span>
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">태그</p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 최근 예약 내역 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">최근 예약 내역</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    인원
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurantReservations.slice(0, 10).map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.guestCount}명
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseInt(reservation.totalAmount).toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {restaurantReservations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              아직 예약 내역이 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;