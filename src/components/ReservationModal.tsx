import React, { useState } from 'react';
import { X } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { sendReservationEmail } from '../services/emailService';
import { sendPushNotification } from '../services/notificationService';

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
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
    acceptTerms: false,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

  if (!isOpen) return null;

  const calculateAmount = (guests: number) => {
    // 예약금 계산 (인원당 10,000원)
    return guests * 10000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    const totalAmount = calculateAmount(parseInt(formData.guests));
    const reservation = {
      restaurantName,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      totalAmount,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialRequest: formData.specialRequest
      }
    };

    setReservationData(reservation);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    try {
      // 예약 완료 처리
      const finalReservation = {
        ...reservationData,
        payment: paymentData,
        reservationId: `RES_${Date.now()}`,
        status: 'confirmed'
      };

      // 이메일 발송
      await sendReservationEmail(finalReservation);
      
      // 푸시 알림 발송
      await sendPushNotification({
        title: '예약이 완료되었습니다',
        body: `${restaurantName} 예약이 확정되었습니다. (${formData.date} ${formData.time})`,
        userId: 'current-user-id' // 실제 구현 시 현재 사용자 ID 사용
      });

      alert('예약이 완료되었습니다! 확인 이메일을 발송했습니다.');
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        specialRequest: '',
        acceptTerms: false,
      });
      
      onClose();
    } catch (error) {
      console.error('예약 완료 처리 중 오류:', error);
      alert('예약 완료 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
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
                  이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호 <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    날짜 <span className="text-red-600">*</span>
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
                    시간 <span className="text-red-600">*</span>
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
                  인원 <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  required
                />
                {formData.guests && (
                  <p className="text-sm text-gray-600 mt-1">
                    예약금: {calculateAmount(parseInt(formData.guests)).toLocaleString()}원
                  </p>
                )}
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
                  placeholder="알레르기, 선호 좌석 등 특별한 요청사항이 있으시면 적어주세요."
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
                  이용약관 및 개인정보처리방침에 동의합니다 <span className="text-red-600">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                결제하고 예약하기
              </button>
            </div>
          </form>
        </div>
      </div>

      {reservationData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          reservationData={reservationData}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default ReservationModal;