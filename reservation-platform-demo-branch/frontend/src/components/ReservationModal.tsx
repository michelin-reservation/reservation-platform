import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createReservation } from '../data/reservations';
import { useAuth } from '../contexts/AuthContext';
import { restaurants } from '../data/restaurants';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantId?: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  restaurantId
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      if (!restaurantId) {
        throw new Error('레스토랑 정보를 찾을 수 없습니다.');
      }

      const restaurant = restaurants.find(r => r.id === restaurantId);
      if (!restaurant) {
        throw new Error('레스토랑 정보를 찾을 수 없습니다.');
      }

      // 예약 생성
      const newReservation = createReservation({
        userId: user.id,
        restaurantId: restaurantId,
        restaurantName: restaurant.nameKorean || restaurant.name,
        userName: formData.name,
        userEmail: user.email,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        specialRequest: formData.specialRequest || undefined,
        status: 'pending',
        totalAmount: 0, // 실제로는 메뉴에 따라 계산
        paymentStatus: 'pending'
      });

      console.log('예약 생성됨:', newReservation);
      setSuccess(true);
      
      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          name: user?.name || '',
          date: '',
          time: '',
          guests: '',
          specialRequest: '',
          acceptTerms: false,
        });
      }, 2000);
      
    } catch (err: any) {
      console.error('예약 실패:', err);
      setApiError(err.message || '예약에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-1">{restaurantName}</h2>
        <p className="text-gray-600 mb-4">예약은 영업일 기준 2일 이내 확정됩니다</p>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            예약이 성공적으로 완료되었습니다!
          </div>
        )}

        {!user && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded text-sm">
            예약을 하려면 로그인이 필요합니다.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={!user}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  날짜
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  disabled={!user}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시간
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  disabled={!user}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                인원
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                required
                disabled={!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요청사항
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                disabled={!user}
                placeholder="특별한 요청사항이 있으시면 입력해주세요"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
                disabled={!user}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                이용약관에 동의합니다
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading || !user}
            >
              {loading ? '예약 중...' : '예약하기'}
            </button>
            {apiError && (
              <p className="text-red-600 text-sm mt-2">{apiError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;