import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DailyStats {
  date: string;
  reservations: number;
  revenue: number;
}

interface MenuStats {
  name: string;
  sales: number;
  revenue: number;
}

interface TimeSlotStats {
  timeSlot: string;
  reservations: number;
}

const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [menuStats, setMenuStats] = useState<MenuStats[]>([]);
  const [timeSlotStats, setTimeSlotStats] = useState<TimeSlotStats[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/statistics');
      if (!response.ok) throw new Error('통계를 불러오지 못했습니다.');
      const data = await response.json();
      setDailyStats(data.dailyStats);
      setMenuStats(data.menuStats);
      setTimeSlotStats(data.timeSlotStats);
      setTotalRevenue(data.totalRevenue);
      setTotalReservations(data.totalReservations);
      setAverageRating(data.averageRating);
    } catch (err) {
      setError('통계를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">통계</h1>

          {/* 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                총 매출
              </h2>
              <p className="text-3xl font-bold text-red-600">
                {totalRevenue.toLocaleString()}원
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                총 예약 수
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {totalReservations.toLocaleString()}건
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                평균 평점
              </h2>
              <p className="text-3xl font-bold text-yellow-600">
                {averageRating.toFixed(1)}
              </p>
            </div>
          </div>

          {/* 일별 예약 및 매출 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">일별 예약 및 매출</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="reservations"
                    name="예약 수"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="매출"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 메뉴별 매출 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">메뉴별 매출</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={menuStats}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {menuStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 시간대별 예약 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">시간대별 예약</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSlotStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeSlot" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="reservations"
                    name="예약 수"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage; 