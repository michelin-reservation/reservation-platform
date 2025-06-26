import React, { useState } from 'react';
import { Phone, Calendar, MapPin, Clock, Star, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { requestVipConcierge } from '../../api/vipApi';
import { vipConciergeServices } from '../../data/vip';

const VipConcierge: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !description) {
      alert('서비스 유형과 상세 요청사항을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestVipConcierge({
        type: selectedService,
        description,
        preferredDate: preferredDate || undefined
      });
      
      setSubmitted(true);
      setSelectedService('');
      setDescription('');
      setPreferredDate('');
      
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      
    } catch (err) {
      alert(err instanceof Error ? err.message : '컨시어지 요청에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceTitle = (serviceId: string) => {
    const service = vipConciergeServices.find(s => s.id === serviceId);
    return service ? service.title : '';
  };

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'reservation': return <Calendar className="text-blue-600" size={24} />;
      case 'transportation': return <MapPin className="text-green-600" size={24} />;
      case 'event': return <Star className="text-purple-600" size={24} />;
      case 'recommendation': return <CheckCircle className="text-orange-600" size={24} />;
      default: return <Phone className="text-red-600" size={24} />;
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Phone className="text-red-900 mr-3" size={24} />
        <h2 className="text-xl font-bold">VIP 전용 컨시어지 서비스</h2>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-2" size={20} />
            <p className="text-green-800">컨시어지 요청이 성공적으로 접수되었습니다. 24시간 내에 연락드리겠습니다.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 서비스 선택 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">서비스 유형 선택</h3>
          <div className="space-y-4">
            {vipConciergeServices.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === service.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getServiceIcon(service.id)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{service.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-500 flex items-center">
                          <CheckCircle className="text-green-500 mr-1" size={12} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요청 폼 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">상세 요청사항</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선택된 서비스
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                {selectedService ? getServiceTitle(selectedService) : '서비스를 선택해주세요'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 요청사항 *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="구체적인 요청사항을 자세히 작성해주세요. 예: 특정 날짜, 인원수, 예산, 특별 요청사항 등"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 날짜 (선택사항)
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedService || !description || isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                !selectedService || !description || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-900 text-white hover:bg-red-800'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  요청 중...
                </div>
              ) : (
                '컨시어지 요청하기'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 서비스 안내 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center mb-4">
          <MessageCircle className="text-blue-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-blue-900">컨시어지 서비스 안내</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">서비스 시간</h4>
            <div className="flex items-center text-sm text-blue-700 mb-1">
              <Clock className="mr-2" size={16} />
              <span>24시간 운영</span>
            </div>
            <div className="flex items-center text-sm text-blue-700 mb-1">
              <Calendar className="mr-2" size={16} />
              <span>연중무휴</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2">연락 방법</h4>
            <div className="flex items-center text-sm text-blue-700 mb-1">
              <Phone className="mr-2" size={16} />
              <span>전화: 02-1234-5678</span>
            </div>
            <div className="flex items-center text-sm text-blue-700 mb-1">
              <Mail className="mr-2" size={16} />
              <span>이메일: vip@eie.com</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">서비스 특징</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• VIP 전용 전담 매니저 배정</li>
            <li>• 맞춤형 서비스 기획 및 실행</li>
            <li>• 실시간 진행 상황 업데이트</li>
            <li>• 사후 만족도 조사 및 피드백</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VipConcierge;