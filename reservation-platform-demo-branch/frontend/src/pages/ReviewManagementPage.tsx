import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Star, Trash2, Flag, Check, X } from 'lucide-react';

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isReported: boolean;
}

const ReviewManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/reviews');
      if (!response.ok) throw new Error('리뷰를 불러오지 못했습니다.');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError('리뷰를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/reviews/${id}/approve`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('리뷰를 승인하지 못했습니다.');

      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: 'approved' } : review
        )
      );
      setSuccess('리뷰가 승인되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('리뷰를 승인하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/reviews/${id}/reject`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('리뷰를 거절하지 못했습니다.');

      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: 'rejected' } : review
        )
      );
      setSuccess('리뷰가 거절되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('리뷰를 거절하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/business/reviews/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('리뷰를 삭제하지 못했습니다.');

      setReviews(reviews.filter((review) => review.id !== id));
      setSuccess('리뷰가 삭제되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('리뷰를 삭제하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/reviews/${id}/report`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('리뷰를 신고하지 못했습니다.');

      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, isReported: true } : review
        )
      );
      setSuccess('리뷰가 신고되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('리뷰를 신고하는 중 오류가 발생했습니다.');
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">리뷰 관리</h1>

          {/* 리뷰 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium mr-2">
                          {review.userName}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.content}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="p-2 text-green-600 hover:text-green-800"
                            title="승인"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => handleReject(review.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="거절"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                      {!review.isReported && (
                        <button
                          onClick={() => handleReport(review.id)}
                          className="p-2 text-yellow-600 hover:text-yellow-800"
                          title="신고"
                        >
                          <Flag size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="삭제"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  {review.isReported && (
                    <div className="mt-2 text-sm text-red-600">
                      신고된 리뷰입니다.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
        </div>
      </main>
    </div>
  );
};

export default ReviewManagementPage; 