import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, MapPin, Phone, Save } from 'lucide-react';
import Header from '../../components/Header';
import BusinessFooter from '../../components/BusinessFooter';

const RestaurantSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: '서교난면방',
    nameEnglish: 'Seogyonamnyeongbang',
    address: '서울특별시 마포구 동교로 12길 16',
    phone: '0507-1487-0943',
    description: '이탈리안과 한식 전통 레스토랑. 세프로서 건정한 지진한 뛰어난 컨념의 셰프의 개성 있는 또 모히 레스토랑 서교난면방.',
    capacity: 20,
    tableConfig: {
      table2: 6,
      table4: 2,
      table6: 1
    },
    operatingHours: {
      monday: { open: '11:00', close: '21:00', closed: false },
      tuesday: { open: '11:00', close: '21:00', closed: false },
      wednesday: { open: '11:00', close: '21:00', closed: false },
      thursday: { open: '11:00', close: '21:00', closed: false },
      friday: { open: '11:00', close: '21:00', closed: false },
      saturday: { open: '11:00', close: '21:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    },
    breakTime: {
      enabled: true,
      start: '15:00',
      end: '17:30'
    },
    lastOrder: '20:30',
    reservationSettings: {
      advanceBookingDays: 30,
      minPartySize: 1,
      maxPartySize: 8,
      requireDeposit: false,
      depositAmount: 0,
      cancellationPolicy: '예약 취소는 방문 24시간 전까지 가능합니다.'
    }
  });

  const [activeTab, setActiveTab] = useState('basic');

  const dayNames = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일'
  };

  const handleSave = () => {
    // Save settings logic here
    alert('설정이 저장되었습니다.');
  };

  const updateOperatingHours = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link to="/business" className="inline-flex items-center text-gray-600 hover:text-red-600 mr-4">
              <ArrowLeft size={16} className="mr-1" />
              <span>대시보드로 돌아가기</span>
            </Link>
            <div className="flex space-x-2">
              <Link to="/business/menu" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">메뉴 관리</Link>
              <Link to="/business/notices" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">공지/이벤트</Link>
              <Link to="/business/settings" className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-600">설정</Link>
              <Link to="/business/help" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">도움말</Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">레스토랑 설정</h1>
          <p className="text-red-600 mt-1">기본 정보 및 운영 설정 관리</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { id: 'basic', label: '기본 정보' },
                { id: 'hours', label: '영업시간' },
                { id: 'seating', label: '좌석 관리' },
                { id: 'reservation', label: '예약 설정' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
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
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      레스토랑명 (한국어)
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      레스토랑명 (영어)
                    </label>
                    <input
                      type="text"
                      value={settings.nameEnglish}
                      onChange={(e) => setSettings({ ...settings, nameEnglish: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={16} className="inline mr-1" />
                    주소
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" />
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    레스토랑 소개
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">영업시간 설정</h3>
                
                <div className="space-y-4">
                  {Object.entries(dayNames).map(([day, dayName]) => (
                    <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-20">
                        <span className="font-medium">{dayName}</span>
                      </div>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.operatingHours[day as keyof typeof settings.operatingHours].closed}
                          onChange={(e) => updateOperatingHours(day, 'closed', e.target.checked)}
                          className="mr-2"
                        />
                        휴무
                      </label>
                      
                      {!settings.operatingHours[day as keyof typeof settings.operatingHours].closed && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} className="text-gray-400" />
                            <input
                              type="time"
                              value={settings.operatingHours[day as keyof typeof settings.operatingHours].open}
                              onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                              className="border border-gray-300 rounded-md p-1"
                            />
                            <span>~</span>
                            <input
                              type="time"
                              value={settings.operatingHours[day as keyof typeof settings.operatingHours].close}
                              onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                              className="border border-gray-300 rounded-md p-1"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">브레이크 타임</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.breakTime.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          breakTime: { ...settings.breakTime, enabled: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      브레이크 타임 사용
                    </label>
                    
                    {settings.breakTime.enabled && (
                      <div className="flex items-center space-x-2 ml-6">
                        <input
                          type="time"
                          value={settings.breakTime.start}
                          onChange={(e) => setSettings({
                            ...settings,
                            breakTime: { ...settings.breakTime, start: e.target.value }
                          })}
                          className="border border-gray-300 rounded-md p-1"
                        />
                        <span>~</span>
                        <input
                          type="time"
                          value={settings.breakTime.end}
                          onChange={(e) => setSettings({
                            ...settings,
                            breakTime: { ...settings.breakTime, end: e.target.value }
                          })}
                          className="border border-gray-300 rounded-md p-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">마지막 주문 시간</h4>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <input
                      type="time"
                      value={settings.lastOrder}
                      onChange={(e) => setSettings({ ...settings, lastOrder: e.target.value })}
                      className="border border-gray-300 rounded-md p-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seating' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">좌석 관리</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users size={16} className="inline mr-1" />
                    총 수용 인원
                  </label>
                  <input
                    type="number"
                    value={settings.capacity}
                    onChange={(e) => setSettings({ ...settings, capacity: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-4">테이블 구성</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        2인 테이블
                      </label>
                      <input
                        type="number"
                        value={settings.tableConfig.table2}
                        onChange={(e) => setSettings({
                          ...settings,
                          tableConfig: { ...settings.tableConfig, table2: parseInt(e.target.value) }
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        4인 테이블
                      </label>
                      <input
                        type="number"
                        value={settings.tableConfig.table4}
                        onChange={(e) => setSettings({
                          ...settings,
                          tableConfig: { ...settings.tableConfig, table4: parseInt(e.target.value) }
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        6인 테이블
                      </label>
                      <input
                        type="number"
                        value={settings.tableConfig.table6}
                        onChange={(e) => setSettings({
                          ...settings,
                          tableConfig: { ...settings.tableConfig, table6: parseInt(e.target.value) }
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reservation' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">예약 설정</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    예약 가능 일수
                  </label>
                  <input
                    type="number"
                    value={settings.reservationSettings.advanceBookingDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      reservationSettings: {
                        ...settings.reservationSettings,
                        advanceBookingDays: parseInt(e.target.value)
                      }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최소 예약 인원
                    </label>
                    <input
                      type="number"
                      value={settings.reservationSettings.minPartySize}
                      onChange={(e) => setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          minPartySize: parseInt(e.target.value)
                        }
                      })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최대 예약 인원
                    </label>
                    <input
                      type="number"
                      value={settings.reservationSettings.maxPartySize}
                      onChange={(e) => setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          maxPartySize: parseInt(e.target.value)
                        }
                      })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.reservationSettings.requireDeposit}
                      onChange={(e) => setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          requireDeposit: e.target.checked
                        }
                      })}
                      className="mr-2"
                    />
                    예약금 요구
                  </label>
                  
                  {settings.reservationSettings.requireDeposit && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        예약금 금액
                      </label>
                      <input
                        type="number"
                        value={settings.reservationSettings.depositAmount}
                        onChange={(e) => setSettings({
                          ...settings,
                          reservationSettings: {
                            ...settings.reservationSettings,
                            depositAmount: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    취소 정책
                  </label>
                  <textarea
                    value={settings.reservationSettings.cancellationPolicy}
                    onChange={(e) => setSettings({
                      ...settings,
                      reservationSettings: {
                        ...settings.reservationSettings,
                        cancellationPolicy: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                저장하기
              </button>
            </div>
          </div>
        </div>
      </main>
      <BusinessFooter />
    </div>
  );
};

export default RestaurantSettings; 