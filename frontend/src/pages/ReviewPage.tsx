import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Star, ArrowLeft } from 'lucide-react';

const ReviewPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (restaurantId) {
      setLoading(true);
      fetch(`/api/restaurants/${restaurantId}`)
        .then(res => res.json())
        .then(data => {
          setRestaurant(data);
        })
        .catch(() => setError('레스토랑 정보를 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [restaurantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content) {
      setError('평점과 리뷰 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          rating,
          content,
        }),
      });

      if (!response.ok) throw new Error('리뷰 등록에 실패했습니다.');
      
      navigate('/dashboard?tab=reviews');
    } catch (err) {
      setError('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-red-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>이전</span>
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">리뷰 작성</h1>
            
            {restaurant && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">{restaurant.nameKorean}</h2>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평점
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-32 border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="레스토랑에 대한 경험을 공유해주세요."
                />
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">{error}</div>
              )}

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
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  리뷰 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage; 