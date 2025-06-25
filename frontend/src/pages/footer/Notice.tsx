import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import { Pin } from 'lucide-react';

const notices = [
  {
    id: 1,
    title: "프리미엄 외식 컨시어지 플랫폼 EIE 오픈 안내",
    date: "2025-06-23",
    content: [
      "프리미엄 외식 컨시어지 플랫폼 EIE가 2025년 6월 26일 오픈합니다.",
      "EIE는 전문 컨시어지 매니저가 고객님의 취향과 상황에 맞는 최적의 레스토랑을 제안해 드립니다.",
      "간편한 예약과 맞춤형 서비스로 소중한 순간을 더 가치 있게 만들어보세요.",
    ]
  }
];

const Notice: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const [openNoticeId, setOpenNoticeId] = useState<number | null>(null);

  const handleNoticeClick = (id: number) => {
    setOpenNoticeId(openNoticeId === id ? null : id); // 토글 방식
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const filtered = notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotices(filtered);
    setOpenNoticeId(null); // 검색 시 펼침 초기화
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mt-20 mb-8">공지사항</h1>
      </div>
      <div className="max-w-6xl mx-auto py-10 px-4 mb-36">
        <div className="w-full max-w-xs mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="bg-white shadow-md rounded-lg">
          {filteredNotices.length > 0 ? (
            <ul>
              {filteredNotices.map((notice) => (
                <li key={notice.id} className="border-b last:border-none">
                  <div
                    className="flex justify-between items-center px-8 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleNoticeClick(notice.id)}
                  >
                    <span className="flex items-center gap-4 text-left text-gray-700 font-medium">
                    <Pin size={20} color="#f59e42" />
                      {notice.title}
                    </span>
                    <span className="text-right text-gray-500 text-sm">
                      {notice.date}
                    </span>
                  </div>
                  {/* 상세 내용 토글 */}
                  {openNoticeId === notice.id && (
                    <div className="bg-gray-50 px-8 py-6 text-gray-700 text-base border-t">
                      {notice.content.map((line, idx) => (
                        <p key={idx} className="mb-2">{line}</p>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 text-center py-11">
        <blockquote className="mt-6 text-lg font-medium mb-10 leading-10 pl-4">
          우리는 믿습니다. 최고의 외식은 음식이 아닌, 그 순간을 함께하는 ‘경험’에서 시작된다는 것을.<br />
          <b>지금 " <span className="text-red-700 font-serif font-bold text-2xl">EIE</span> " 와 함께하세요.</b>
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
