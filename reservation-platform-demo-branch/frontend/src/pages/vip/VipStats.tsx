import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Award, Calendar, Star, Users, Trophy, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getVipStats, VipStats as VipStatsType } from '../../api/vipApi';
import { 
  defaultVipStats, 
  additionalVipStats, 
  monthlyVipData, 
  vipAchievements 
} from '../../data/vip';

const VipStats: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<VipStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const vipStats = await getVipStats();
        setStats(vipStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : '통계 조회에 실패했습니다.');
        // 에러 발생 시 기본 데이터 사용
        setStats(defaultVipStats);
      } finally {
        setLoading(false);
      }
    };

    // user가 있든 없든 VIP 통계를 가져오도록 수정
    fetchStats();
  }, []); // user 의존성 제거

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">이용 통계 및 성과</h2>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-red-900 mr-3" size={24} />
          <h2 className="text-xl font-bold">이용 통계 및 성과</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="text-red-900 mr-3" size={24} />
        <h2 className="text-xl font-bold">이용 통계 및 성과</h2>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">올해 예약 건수</h3>
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalReservations}건</p>
          <p className="text-sm text-gray-500 mt-1">
            전년 대비 +{calculateGrowth(stats.totalReservations, additionalVipStats.lastYear.reservations)}%
          </p>
          <div className="mt-3 bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(stats.totalReservations / 50) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">목표: 50건</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">누적 사용 금액</h3>
            <DollarSign className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.totalSpent.toLocaleString()}원</p>
          <p className="text-sm text-gray-500 mt-1">
            전년 대비 +{calculateGrowth(stats.totalSpent, additionalVipStats.lastYear.spent)}%
          </p>
          <div className="mt-3 bg-green-100 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${(stats.totalSpent / 5000000) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">목표: 500만원</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">평균 리뷰 평점</h3>
            <Award className="text-yellow-600" size={20} />
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
            <div className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            전년 대비 +{calculateGrowth(stats.averageRating, additionalVipStats.lastYear.averageRating)}%
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">즐겨찾기</p>
              <p className="text-2xl font-bold text-purple-600">{stats.favoriteRestaurants}곳</p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">리뷰 작성</p>
              <p className="text-2xl font-bold text-blue-600">{additionalVipStats.currentYear.reviewsWritten}개</p>
            </div>
            <Star className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">특별 이벤트</p>
              <p className="text-2xl font-bold text-green-600">{additionalVipStats.currentYear.specialEvents}회</p>
            </div>
            <Calendar className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VIP 등급</p>
              <p className="text-2xl font-bold text-red-600">{stats.vipLevel}</p>
            </div>
            <Trophy className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">다음 등급 달성 목표</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>예약 목표</span>
              <span>{stats.totalReservations} / {stats.totalReservations + additionalVipStats.goals.reservationsNeeded}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(stats.totalReservations / (stats.totalReservations + additionalVipStats.goals.reservationsNeeded)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {additionalVipStats.goals.reservationsNeeded}건 더 예약하면 {additionalVipStats.goals.nextLevel} 등급
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>사용 금액 목표</span>
              <span>{stats.totalSpent.toLocaleString()} / {(stats.totalSpent + additionalVipStats.goals.spendingNeeded).toLocaleString()}원</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(stats.totalSpent / (stats.totalSpent + additionalVipStats.goals.spendingNeeded)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {additionalVipStats.goals.spendingNeeded.toLocaleString()}원 더 사용하면 {additionalVipStats.goals.nextLevel} 등급
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">업적</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vipAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
              <div className="mr-3">
                {achievement.achieved ? (
                  <Trophy className="text-yellow-500" size={24} />
                ) : (
                  <Target className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.achieved && (
                  <p className="text-xs text-gray-500 mt-1">달성일: {achievement.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipStats;