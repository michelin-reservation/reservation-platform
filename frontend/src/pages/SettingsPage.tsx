import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Save, Upload } from 'lucide-react';

interface BusinessSettings {
  name: string;
  nameKorean: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  reservationSettings: {
    minNoticeHours: number;
    maxAdvanceDays: number;
    maxPartySize: number;
    timeSlotInterval: number;
  };
  logo?: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<BusinessSettings>({
    name: '',
    nameKorean: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    businessHours: {
      monday: { open: '09:00', close: '18:00', isClosed: false },
      tuesday: { open: '09:00', close: '18:00', isClosed: false },
      wednesday: { open: '09:00', close: '18:00', isClosed: false },
      thursday: { open: '09:00', close: '18:00', isClosed: false },
      friday: { open: '09:00', close: '18:00', isClosed: false },
      saturday: { open: '09:00', close: '18:00', isClosed: false },
      sunday: { open: '09:00', close: '18:00', isClosed: true }
    },
    reservationSettings: {
      minNoticeHours: 2,
      maxAdvanceDays: 30,
      maxPartySize: 8,
      timeSlotInterval: 30
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/settings');
      if (!response.ok) throw new Error('설정을 불러오지 못했습니다.');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError('설정을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('설정을 저장하지 못했습니다.');

      setSuccess('설정이 저장되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('설정을 저장하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setLoading(true);
      const response = await fetch('/api/business/logo', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('로고를 업로드하지 못했습니다.');

      const data = await response.json();
      setSettings({ ...settings, logo: data.logoUrl });
      setSuccess('로고가 업로드되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('로고를 업로드하는 중 오류가 발생했습니다.');
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
          <h1 className="text-2xl font-bold mb-8">설정</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 기본 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">기본 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상호명 (영문)
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상호명 (한글)
                  </label>
                  <input
                    type="text"
                    value={settings.nameKorean}
                    onChange={(e) =>
                      setSettings({ ...settings, nameKorean: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) =>
                      setSettings({ ...settings, description: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    로고
                  </label>
                  <div className="flex items-center space-x-4">
                    {settings.logo && (
                      <img
                        src={settings.logo}
                        alt="로고"
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <label className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer flex items-center">
                      <Upload size={20} className="mr-2" />
                      로고 업로드
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 영업 시간 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">영업 시간</h2>
              <div className="space-y-4">
                {Object.entries(settings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            businessHours: {
                              ...settings.businessHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          })
                        }
                        className="border rounded p-2"
                        disabled={hours.isClosed}
                      />
                      <span>~</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            businessHours: {
                              ...settings.businessHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          })
                        }
                        className="border rounded p-2"
                        disabled={hours.isClosed}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.isClosed}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            businessHours: {
                              ...settings.businessHours,
                              [day]: { ...hours, isClosed: e.target.checked }
                            }
                          })
                        }
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">휴무</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 예약 설정 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">예약 설정</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최소 예약 가능 시간 (시간)
                  </label>
                  <input
                    type="number"
                    value={settings.reservationSettings.minNoticeHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          minNoticeHours: parseInt(e.target.value)
                        }
                      })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최대 예약 가능 일수
                  </label>
                  <input
                    type="number"
                    value={settings.reservationSettings.maxAdvanceDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          maxAdvanceDays: parseInt(e.target.value)
                        }
                      })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최대 예약 인원
                  </label>
                  <input
                    type="number"
                    value={settings.reservationSettings.maxPartySize}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          maxPartySize: parseInt(e.target.value)
                        }
                      })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    예약 시간 간격 (분)
                  </label>
                  <input
                    type="number"
                    value={settings.reservationSettings.timeSlotInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reservationSettings: {
                          ...settings.reservationSettings,
                          timeSlotInterval: parseInt(e.target.value)
                        }
                      })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                <Save size={20} className="mr-2" />
                설정 저장
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage; 