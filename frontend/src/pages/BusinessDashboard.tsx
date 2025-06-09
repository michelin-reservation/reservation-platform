import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import { BarChart, Users, Clock, Menu, MessageSquare, Bell, Settings, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import 'react-calendar/dist/Calendar.css';

const BusinessDashboard: React.FC = () => {
  const [date, setDate] = useState<Date | Date[] | null>(new Date());
  const navigate = useNavigate();
  
  // 실제 서비스 연동 전까지는 mock 데이터 사용
  const timeSlots = Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 11}:00`,
    reserved: Math.random() > 0.5,
    guests: Math.floor(Math.random() * 4) + 1,
  }));

  const stats = {
    daily: {
      reservations: 15,
      revenue: 750000,
      occupancy: 85,
      reviews: 4
    },
    monthly: {
      reservations: 450,
      revenue: 22500000,
      occupancy: 78,
      reviews: 120
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">레스토랑 관리</h1>
          <p className="text-red-600 mt-1">예약 및 정보 관리</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">오늘의 예약</h3>
              <Users className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold">{stats.daily.reservations}건</p>
            <p className="text-sm text-gray-500 mt-1">전일 대비 +2건</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">금일 매출</h3>
              <BarChart className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold">{stats.daily.revenue.toLocaleString()}원</p>
            <p className="text-sm text-gray-500 mt-1">목표 달성률 85%</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">좌석 점유율</h3>
              <Clock className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold">{stats.daily.occupancy}%</p>
            <p className="text-sm text-gray-500 mt-1">전주 대비 +5%</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">신규 리뷰</h3>
              <MessageSquare className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold">{stats.daily.reviews}개</p>
            <p className="text-sm text-gray-500 mt-1">평균 평점 4.5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservation Timeline */}
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

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">날짜별 예약 확인</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-0"
            />
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                {date instanceof Date ? date.toLocaleDateString() : ''} 예약 현황
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

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Menu className="text-red-600 mr-2" size={20} />
              <h2 className="text-lg font-bold">메뉴 관리</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/business/menu')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  메뉴 등록/수정
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/menu')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  가격 설정
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/menu')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  품절 관리
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Bell className="text-red-600 mr-2" size={20} />
              <h2 className="text-lg font-bold">공지/이벤트</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/business/notices')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  공지사항 등록
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/notices')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  이벤트 관리
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/notices')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  프로모션 설정
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Settings className="text-red-600 mr-2" size={20} />
              <h2 className="text-lg font-bold">설정</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/business/settings')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  영업시간 설정
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/settings')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  좌석 관리
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/business/settings')}
                  className="text-gray-600 hover:text-red-600 cursor-pointer w-full text-left"
                >
                  알림 설정
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <HelpCircle className="text-red-600 mr-2" size={20} />
            <h2 className="text-lg font-bold">도움말 및 지원</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">고객 지원 센터</h3>
              <p className="text-sm text-gray-600">
                문의사항이나 기술적인 지원이 필요하신가요?
              </p>
              <button onClick={() => navigate('/business/help')} className="mt-3 text-red-600 hover:text-red-700">
                문의하기 →
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">사용 가이드</h3>
              <p className="text-sm text-gray-600">
                관리자 페이지 사용방법을 확인하세요.
              </p>
              <button onClick={() => navigate('/business/help')} className="mt-3 text-red-600 hover:text-red-700">
                가이드 보기 →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;