import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Crown } from 'lucide-react';
import VipReservations from './vip/VipReservations';
import VipBenefits from './vip/VipBenefits';
import VipConcierge from './vip/VipConcierge';
import VipStats from './vip/VipStats';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getVipStats, VipStats as VipStatsType } from '../api/vipApi';
import { defaultVipStats } from '../data/vip';

const VipDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vipStats, setVipStats] = useState<VipStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVipStats = async () => {
      try {
        setLoading(true);
        const stats = await getVipStats();
        setVipStats(stats);
      } catch (err) {
        console.error('VIP 통계 조회 실패:', err);
        // 에러 발생 시 기본 데이터 사용
        setVipStats(defaultVipStats);
      } finally {
        setLoading(false);
      }
    };

    // user가 있든 없든 VIP 통계를 가져오도록 수정
    fetchVipStats();
  }, []); // user 의존성 제거

  /*useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/');
    }
  }, [user, navigate]);*/

  // VIP 레벨 및 등급 유지 정보
  const vipLevel = vipStats?.vipLevel || user?.vipLevel || 'Platinum';
  const reservationsToMaintain = Math.max(0, 50 - (vipStats?.totalReservations || 0));

  const getVipBadgeColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Platinum': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'Diamond': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VIP 마이페이지</h1>
          <p className="text-red-600 mt-1">프리미엄 서비스 및 혜택 관리</p>
        </div>

        {/* VIP Header Section */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`${getVipBadgeColor(vipLevel)} p-3 rounded-full mr-4`}>
                <Crown size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'VIP 회원'}님</h1>
                <div className="flex items-center mt-2">
                  <span className={`${getVipBadgeColor(vipLevel)} px-3 py-1 rounded-full text-sm font-medium mr-3`}>
                    {vipLevel} VIP
                  </span>
                  <span className="text-red-200 text-sm">
                    등급 유지까지 {reservationsToMaintain}건 남음
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-200 text-sm">VIP 혜택 이용률</p>
              <p className="text-2xl font-bold">
                {vipStats ? Math.round((vipStats.benefitsUsed / 20) * 100) : 85}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <VipStats />
        </div>

        {/* Priority Reservations Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VipReservations />
        </div>

        {/* VIP Benefits Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VipBenefits />
        </div>

        {/* Concierge Service Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VipConcierge />
        </div>

        <Link to="/footer/customer-support/faq" className="hover:text-red-600">자주 묻는 질문 (FAQ)</Link>
      </main>
    </div>
  );
};

export default VipDashboard;