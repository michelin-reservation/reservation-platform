import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, Send, Search } from 'lucide-react';
import Header from '../../components/Header';
import BusinessFooter from '../../components/BusinessFooter';

const HelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    category: 'technical',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const faqs = [
    {
      id: '1',
      category: 'reservation',
      question: '예약 취소는 어떻게 처리하나요?',
      answer: '예약 관리 페이지에서 해당 예약을 선택 후 "취소" 버튼을 누르면 취소 고객에게 자동으로 알림이 발송됩니다.'
    },
    {
      id: '2',
      category: 'technical',
      question: '메뉴 정보가 업데이트되지 않아요.',
      answer: '메뉴 수정 후 "저장" 버튼을 클릭하셨는지 확인해주세요. 문제가 지속되면 브라우저 캐시를 삭제하거나 페이지를 새로고침해보세요. 기업 회원의 경우 원격 지원을 받으실 수 있습니다.'
    },
    {
      id: '3',
      category: 'billing',
      question: '수수료는 언제 정산되나요?',
      answer: '매월 말일 기준으로 정산되며, 익월 15일에 등록된 계좌로 입금됩니다.'
    },
    {
      id: '4',
      category: 'account',
      question: '비밀번호를 잊어버렸어요.',
      answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시거나, 고객지원팀으로 연락주시면 도움드리겠습니다.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setContactForm({ category: 'technical', subject: '', message: '', priority: 'normal' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link to="/business" className="inline-flex items-center text-gray-600 hover:text-red-600 mr-4">
              <ArrowLeft size={16} className="mr-1" />
              <span>대시보드로 돌아가기</span>
            </Link>
            <div className="flex space-x-2">
              <Link to="/business/menu" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">메뉴 관리</Link>
              <Link to="/business/notices" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">공지/이벤트</Link>
              <Link to="/business/settings" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">설정</Link>
              <Link to="/business/help" className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-600">도움말</Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">도움말 및 지원</h1>
          <p className="text-red-600 mt-1">자주 묻는 질문과 고객 지원</p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Phone className="mx-auto mb-3 text-red-600" size={32} />
            <h3 className="font-medium mb-2">전화 지원</h3>
            <p className="text-gray-600 text-sm mb-3">평일 09:00 - 18:00</p>
            <a href="tel:1588-1234" className="text-red-600 font-medium">1588-1234</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Mail className="mx-auto mb-3 text-red-600" size={32} />
            <h3 className="font-medium mb-2">이메일 지원</h3>
            <p className="text-gray-600 text-sm mb-3">24시간 접수 가능</p>
            <a href="mailto:support@eie.com" className="text-red-600 font-medium">support@eie.com</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <MessageCircle className="mx-auto mb-3 text-red-600" size={32} />
            <h3 className="font-medium mb-2">실시간 채팅</h3>
            <p className="text-gray-600 text-sm mb-3">평일 09:00 - 18:00</p>
            <button className="text-red-600 font-medium">채팅 시작</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { id: 'faq', label: '자주 묻는 질문', icon: <FileText size={16} /> },
                { id: 'contact', label: '문의하기', icon: <MessageCircle size={16} /> },
                { id: 'guides', label: '사용 가이드', icon: <FileText size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'faq' && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="질문을 검색하세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50">
                          <span className="font-medium">{faq.question}</span>
                          <span className="text-gray-400 group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h3 className="text-lg font-medium mb-6">문의하기</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        문의 유형
                      </label>
                      <select
                        value={contactForm.category}
                        onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="technical">기술적 문제</option>
                        <option value="reservation">예약 관련</option>
                        <option value="billing">정산/결제</option>
                        <option value="account">계정 관리</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        우선순위
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="low">낮음</option>
                        <option value="normal">보통</option>
                        <option value="high">높음</option>
                        <option value="urgent">긴급</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문의 내용
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={6}
                      placeholder="문제 상황을 자세히 설명해주세요..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    문의 보내기
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'guides' && (
              <div>
                <h3 className="text-lg font-medium mb-6">사용 가이드</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">예약 관리 가이드</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      예약 확인, 수락, 거절 및 노쇼 처리 방법을 안내합니다.
                    </p>
                    <button className="text-red-600 text-sm hover:underline">
                      가이드 보기 →
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">메뉴 관리 가이드</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      메뉴 등록, 수정, 품절 처리 방법을 설명합니다.
                    </p>
                    <button className="text-red-600 text-sm hover:underline">
                      가이드 보기 →
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">통계 분석 가이드</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      매출 분석 및 리포트 활용 방법을 안내합니다.
                    </p>
                    <button className="text-red-600 text-sm hover:underline">
                      가이드 보기 →
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">설정 관리 가이드</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      영업시간, 좌석 설정 등 기본 설정 방법을 설명합니다.
                    </p>
                    <button className="text-red-600 text-sm hover:underline">
                      가이드 보기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <BusinessFooter />
    </div>
  );
};

export default HelpSupport; 