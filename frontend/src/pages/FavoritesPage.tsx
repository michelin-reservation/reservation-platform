import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Star, Heart, MapPin, Filter } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => {
        setFavorites(data);
      })
      .catch(() => setError('관심 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveFavorite = async (restaurantId: string) => {
    try {
      const response = await fetch(`/api/favorites/${restaurantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('관심 목록에서 제거하지 못했습니다.');
      
      setFavorites(favorites.filter(fav => fav.restaurant_id !== restaurantId));
    } catch (err) {
      setError('관심 목록에서 제거 중 오류가 발생했습니다.');
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    if (filter === 'all') return true;
    return favorite.type === filter;
  });

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관심 목록</h1>
          <p className="text-red-600 mt-1">저장한 레스토랑</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              <option value="all">전체</option>
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <div key={favorite.restaurant_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(favorite.restaurant_id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <Heart size={20} className="text-red-600" fill="currentColor" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{favorite.nameKorean}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{favorite.address}</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="ml-1 text-sm">{favorite.rating}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{favorite.type}</span>
                </div>
                
                <button
                  onClick={() => navigate(`/restaurants/${favorite.restaurant_id}`)}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">관심 목록이 비어있습니다.</p>
            <button
              onClick={() => navigate('/restaurants')}
              className="mt-4 text-red-600 hover:underline"
            >
              레스토랑 둘러보기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage; 