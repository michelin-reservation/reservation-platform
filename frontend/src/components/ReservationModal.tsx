import React, { useState } from 'react';
import { X } from 'lucide-react';
import { reservationApi } from '../api/reservationApi';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);
    try {
      await reservationApi.create(formData);
    onClose();
    } catch (err: any) {
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
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                required
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
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                이용약관에 동의합니다
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
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