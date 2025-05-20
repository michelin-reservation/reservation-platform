import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import Header from '../components/Header';
import 'react-calendar/dist/Calendar.css';

const BusinessDashboard: React.FC = () => {
  const [date, setDate] = useState(new Date());
  
  const timeSlots = Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 11}:00`,
    reserved: Math.random() > 0.5,
    guests: Math.floor(Math.random() * 4) + 1,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">레스토랑 관리</h1>
          <p className="text-red-600 mt-1">예약 및 정보 관리</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">금일 예약 현황</h2>
            <div className="space-y-3">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    slot.reserved
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{slot.time}</span>
                    {slot.reserved ? (
                      <span className="text-red-600">
                        예약됨 ({slot.guests}명)
                      </span>
                    ) : (
                      <span className="text-gray-500">가능</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">날짜별 예약 확인</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-0"
            />
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                {date.toLocaleDateString()} 예약 현황
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>총 예약</span>
                  <span className="font-medium">12건</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>예약 인원</span>
                  <span className="font-medium">45명</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>특별 요청</span>
                  <span className="font-medium">3건</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">레스토랑 정보 관리</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">기본 정보</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  영업 시간 수정
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  메뉴 관리
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  사진 갤러리 관리
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">예약 설정</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  예약 가능 시간 설정
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  테이블 관리
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:border-red-500">
                  특별 이벤트 설정
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;