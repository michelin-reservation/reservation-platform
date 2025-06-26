import React, { useEffect, useState } from 'react';
import { Gift, Star, Crown, Users, Calendar, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import { getVipBenefits, useVipBenefit, VipBenefit } from '../../api/vipApi';
import { defaultVipBenefits, vipLevelBenefits } from '../../data/vip';

const VipBenefits: React.FC = () => {
  const [benefits, setBenefits] = useState<VipBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingBenefit, setUsingBenefit] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        const vipBenefits = await getVipBenefits();
        setBenefits(vipBenefits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'VIP 혜택 목록 조회에 실패했습니다.');
        // 에러 발생 시 기본 데이터 사용
        setBenefits(defaultVipBenefits);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  const handleUseBenefit = async (benefitId: string) => {
    try {
      setUsingBenefit(benefitId);
      await useVipBenefit(benefitId);
      
      // 혜택 사용 후 목록 새로고침
      const updatedBenefits = await getVipBenefits();
      setBenefits(updatedBenefits);
      
      alert('혜택이 성공적으로 사용되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '혜택 사용에 실패했습니다.');
    } finally {
      setUsingBenefit(null);
    }
  };

  const getBenefitIcon = (benefitName: string) => {
    if (benefitName.includes('발레파킹')) return <MapPin className="text-blue-600" size={24} />;
    if (benefitName.includes('컨시어지')) return <Phone className="text-green-600" size={24} />;
    if (benefitName.includes('메뉴')) return <Star className="text-yellow-600" size={24} />;
    if (benefitName.includes('예약')) return <Calendar className="text-purple-600" size={24} />;
    return <Gift className="text-red-600" size={24} />;
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.min((used / max) * 100, 100);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Gift className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">VIP 전용 혜택</h2>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      </div>
    );
  }

  if (error && benefits.length === 0) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Gift className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">VIP 전용 혜택</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Gift className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">VIP 전용 혜택</h2>
        </div>
        <div className="text-sm text-gray-500">
          {benefits.filter(b => b.isActive).length}개 혜택 활성화
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getBenefitIcon(benefit.name)}
                <div className="ml-3">
                  <h3 className="font-semibold text-lg text-gray-900">{benefit.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                {benefit.isActive ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>사용 횟수</span>
                <span>{benefit.usedCount} / {benefit.maxUses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getUsagePercentage(benefit.usedCount, benefit.maxUses)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                남은 횟수: {benefit.maxUses - benefit.usedCount}회
              </div>
              <button
                onClick={() => handleUseBenefit(benefit.id)}
                disabled={!benefit.isActive || benefit.usedCount >= benefit.maxUses || usingBenefit === benefit.id}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !benefit.isActive || benefit.usedCount >= benefit.maxUses
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-900 text-white hover:bg-red-800'
                }`}
              >
                {usingBenefit === benefit.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    처리중...
                  </div>
                ) : (
                  '혜택 사용'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
        <div className="flex items-center mb-4">
          <Crown className="text-red-900 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-red-900">VIP 등급별 혜택 안내</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Crown className="text-yellow-600" size={24} />
            </div>
            <h4 className="font-semibold text-yellow-800 mb-2">{vipLevelBenefits.gold.name}</h4>
            <p className="text-sm text-yellow-700 mb-3">{vipLevelBenefits.gold.requirements}</p>
            <ul className="text-xs text-yellow-600 space-y-1">
              {vipLevelBenefits.gold.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Crown className="text-gray-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{vipLevelBenefits.platinum.name}</h4>
            <p className="text-sm text-gray-700 mb-3">{vipLevelBenefits.platinum.requirements}</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {vipLevelBenefits.platinum.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Crown className="text-purple-600" size={24} />
            </div>
            <h4 className="font-semibold text-purple-800 mb-2">{vipLevelBenefits.diamond.name}</h4>
            <p className="text-sm text-purple-700 mb-3">{vipLevelBenefits.diamond.requirements}</p>
            <ul className="text-xs text-purple-600 space-y-1">
              {vipLevelBenefits.diamond.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipBenefits;