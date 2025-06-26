import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import { getVipReservations, VipReservation } from '../../api/vipApi';
import { defaultVipReservations } from '../../data/vip';

const VipReservations: React.FC = () => {
  const [reservations, setReservations] = useState<VipReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const vipReservations = await getVipReservations();
        setReservations(vipReservations);
      } catch (err) {
        setError(err instanceof Error ? err.message : '예약 목록 조회에 실패했습니다.');
        // 에러 발생 시 기본 데이터 사용
        setReservations(defaultVipReservations);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '확정': return 'text-green-600 bg-green-100';
      case '대기': return 'text-yellow-600 bg-yellow-100';
      case '취소': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Calendar className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">우선 예약 현황</h2>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      </div>
    );
  }

  if (error && reservations.length === 0) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Calendar className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">우선 예약 현황</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">우선 예약 현황</h2>
        </div>
        <div className="text-sm text-gray-500">
          총 {reservations.length}건의 예약
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">아직 VIP 예약이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">VIP 혜택으로 우선 예약을 이용해보세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {reservation.restaurantName}
                    </h3>
                    {reservation.priority && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        VIP 우선
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2" size={16} />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2" size={16} />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2" size={16} />
                      <span>{reservation.people}명</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        상세보기
                      </button>
                      {reservation.status === '대기' && (
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          취소
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Star className="text-blue-600 mr-2" size={20} />
          <h3 className="font-medium text-blue-900">VIP 우선 예약 혜택</h3>
        </div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 인기 레스토랑 우선 예약 가능</li>
          <li>• 예약 확정률 95% 이상</li>
          <li>• 특별 요청 사항 우선 처리</li>
          <li>• 예약 변경/취소 수수료 면제</li>
        </ul>
      </div>
    </div>
  );
};

export default VipReservations;