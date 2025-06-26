import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const VIPServices: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">VIP 전용 서비스 안내</h1> 
      </div>
      <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="py-10 bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">VIP 멤버십 안내</h1>
        </section>
        {/* 카드 발급 기준 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">카드 발급 기준</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>발급 대상:</strong> EIE 제휴 카드사의 VIP 등급 회원
            </li>
            <li>
              <strong>연회비:</strong> 카드사별 VIP 등급 유지 조건에 따름
            </li>
            <li>
              <strong>카드 형태:</strong> 실물 카드 또는 모바일 카드 (카드사별 상이)
            </li>
          </ul>
        </section>

        {/* 멤버십 주요 혜택 */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">멤버십 주요 혜택</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">혜택 구분</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">프리미엄 레스토랑 예약 대행</td>
                  <td className="px-4 py-2 border-b text-sm">제휴된 미슐랭/파인 다이닝 레스토랑 예약 전담 서비스 제공</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">고객 맞춤 컨시어지</td>
                  <td className="px-4 py-2 border-b text-sm">기념일, 비즈니스 미팅 등 맞춤 외식 제안 및 상담 가능</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">우선 예약 혜택</td>
                  <td className="px-4 py-2 border-b text-sm">일반 고객보다 빠른 선예약 접수 혜택</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">전용 와인 셀렉션 제안</td>
                  <td className="px-4 py-2 border-b text-sm">소믈리에 큐레이션 기반 와인 페어링 컨설팅</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">전용 이벤트 초청</td>
                  <td className="px-4 py-2 border-b text-sm">회원 한정 셰프 테이스팅 디너, 브랜드 디너 초청 등</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b text-sm">VIP 웰컴 기프트</td>
                  <td className="px-4 py-2 border-b text-sm">신규 가입 시 한정판 웰컴 기프트 증정 (카드사별 상이)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 카드 신청 방법 */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">카드 신청 방법</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li> <span className="font-serif text-lg font-medium">EIE</span> 웹사이트에서 신청</li>
            <li>제휴 카드사 홈페이지에서 신청 가능</li>
          </ul>
        </section>

        {/* 유의사항 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">유의사항</h2>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>본 멤버십은 제휴 카드사 VIP 등급 고객에 한해 발급됩니다. 일반 고객 신청은 제한됩니다.</li>
            <li>일부 혜택은 제휴 레스토랑 사정에 따라 변경 또는 조기 마감될 수 있습니다.</li>
            <li>예약 취소 및 변경 정책은 각 레스토랑 정책을 따릅니다.</li>
            <li>혜택 제공 범위는 EIE와 제휴한 국내 레스토랑에 한합니다.</li>
            <li>카드 분실 시 재발급은 카드사 정책에 따릅니다.</li>
          </ul>
        </section>
      </main>

    {/* Final CTA Section */}
    <div className="bg-gray-300 text-gray-800 text-center py-11">
            <blockquote className="mt-6 text-lg font-medium mb-10 leading-10 pl-4">
          우리는 믿습니다. 최고의 외식은 음식이 아닌, 그 순간을 함께하는 ‘경험’에서 시작된다는 것을.<br />
          <b>지금 " <span className="text-red-700 font-serif font-bold text-2xl">EIE</span> " 와 함께하세요.</b>
        </blockquote>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-4">
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/register')}
          >
            회원가입하기
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
            멤버십 안내
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

export default VIPServices;
