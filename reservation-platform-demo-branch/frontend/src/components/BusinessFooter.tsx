import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const BusinessFooter: React.FC = () => {
  const navigate = useNavigate();
  return (
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
  );
};

export default BusinessFooter; 