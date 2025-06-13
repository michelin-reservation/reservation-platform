import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Settings, Clock, Users, Bell } from 'lucide-react';
import { businessApi } from '../api/businessApi';

interface BusinessSettings {
  businessHours: { [key: string]: { open: string; close: string } };
  seats: { total: number; tables: { id: number; name: string; capacity: number }[] };
  notifications: { reservationConfirm: boolean; reservationReminder: boolean; reviewResponse: boolean; marketing: boolean };
}

const BusinessSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<BusinessSettings>({
    businessHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '21:00' }
    },
    seats: { total: 50, tables: [] },
    notifications: { reservationConfirm: true, reservationReminder: true, reviewResponse: true, marketing: false }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await businessApi.getSettings() as BusinessSettings;
        setSettings(data);
      } catch {
        setError('설정을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await businessApi.updateSettings(settings);
      setSuccess('설정이 저장되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('설정을 저장하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">비즈니스 설정</h1>

          <form onSubmit={handleSave} className="space-y-8">
            {/* 영업시간 설정 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="text-red-600 mr-2" size={20} />
                <h2 className="text-lg font-bold">영업시간 설정</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <span className="w-24">{day}</span>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        }))
                      }
                      className="border rounded p-2"
                    />
                    <span>~</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        }))
                      }
                      className="border rounded p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 좌석 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Users className="text-red-600 mr-2" size={20} />
                <h2 className="text-lg font-bold">좌석 관리</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    총 좌석 수
                  </label>
                  <input
                    type="number"
                    value={settings.seats.total}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seats: { ...prev.seats, total: parseInt(e.target.value) }
                      }))
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    테이블 설정
                  </label>
                  {settings.seats.tables.map((table) => (
                    <div key={table.id} className="flex items-center space-x-4 mb-2">
                      <input
                        type="text"
                        value={table.name}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            seats: {
                              ...prev.seats,
                              tables: prev.seats.tables.map((t) =>
                                t.id === table.id ? { ...t, name: e.target.value } : t
                              )
                            }
                          }))
                        }
                        className="border rounded p-2"
                        placeholder="테이블 이름"
                      />
                      <input
                        type="number"
                        value={table.capacity}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            seats: {
                              ...prev.seats,
                              tables: prev.seats.tables.map((t) =>
                                t.id === table.id
                                  ? { ...t, capacity: parseInt(e.target.value) }
                                  : t
                              )
                            }
                          }))
                        }
                        className="border rounded p-2"
                        placeholder="수용 인원"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 알림 설정 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Bell className="text-red-600 mr-2" size={20} />
                <h2 className="text-lg font-bold">알림 설정</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>예약 확정 알림</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.reservationConfirm}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            reservationConfirm: e.target.checked
                          }
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>예약 리마인더</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.reservationReminder}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            reservationReminder: e.target.checked
                          }
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BusinessSettingsPage; 