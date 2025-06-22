import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';

const notices = [
  {
    id: 1,
    title: "플랫폼 및 서비스 운영 안내",
    date: "2025-06-21",
  },
  {
    id: 2,
    title: "VIP 멤버십 서비스 업데이트",
    date: "2025-06-18",
  }
];

const Notice: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleNoticeClick = (id: number) => {
    navigate(`/notice/${id}`);
  };

const handleSearch = () => {
    console.log("검색어:", searchTerm); // 필요에 따라 검색어 처리
  };

  return (
    <div className="min-h-screen font-serif bg-gray-50">
        <Header />
        <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">공지사항</h1> 
      </div>
      <div className="max-w-6xl mx-auto font-serif py-10 px-4 mb-36">
        <div className="w-full max-w-xs mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {notices.map((notice) => (
              <li
                key={notice.id}
                className="flex justify-between items-center px-8 py-4 border-b last:border-none hover:bg-gray-50 cursor-pointer"
                onClick={() => handleNoticeClick(notice.id)}
              >
                <span className="text-left text-gray-700 font-medium">
                  {notice.title}
                </span>
                <span className="text-right text-gray-500 text-sm">
                  {notice.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 text-center py-8">
        <blockquote className="mt-2 text-lg font-medium mb-8 leading-8 pl-4">
        우리는 믿습니다. 최고의 외식은 음식이 아닌, 그 순간을 함께하는 ‘경험’에서 시작된다는 것을.<br />
          <b>지금 " EIE Concierge " 와 함께하세요.</b>
        </blockquote>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-4">
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/')}
          >
            컨시어지 예약하러 가기
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/customer-support/service-guide')}
          >
            서비스 이용 가이드 보기
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/service-contents/membership')}
          >
            멤버십 안내 확인하기
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/customer-support/faq')}
          >
            자주 묻는 질문 (FAQ)
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Notice;
