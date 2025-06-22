import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";

const BrandStory: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 font-serif text-gray-800">
      <Header />
      {/* 이미지 섹션 추가 */}
      <section
        className="w-full relative bg-black"
        style={{
          backgroundImage: `url(https://png.pngtree.com/background/20231101/original/pngtree-intimate-dining-experience-a-3d-render-of-a-table-for-two-picture-image_5828638.jpg)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '320px', // 세로 길이를 늘림
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            width: '100%',
            height: '100%',
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div>
            <h1 className="text-4xl text-center font-semibold text-[#FAFAF9] mb-4">
              브랜드  스토리
            </h1>
            
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mt-12 mb-16">
          <h1 className="text-4xl font-semibold text-gray-800 mb-8">
              <span className="text-red-700">EIE Concierge</span> 의 비전
            </h1>
          <p className="text-2xl font-medium text-gray-700">" 우리는 단순히 식사를 예약하지 않습니다. 추억을 설계합니다. "</p>
        </div>

        <div className="bg-white text-center shadow-lg p-14">
          <p className="text-lg leading-relaxed text-gray-700 mb-10">
            EIE Concierge는 미슐랭 스타 레스토랑을 비롯한 고급 다이닝 경험을 누구보다 특별하게 만들어드립니다.
          </p>
          <p className="text-lg leading-10 text-gray-700 mb-16">
            카드사 VIP 전용 고객을 위한, <br />오직 EIE Concierge만이 제공하는 프라이빗 외식 컨시어지 서비스를 통해<br />그날의 목적, 그 순간의 감정, 그리고 그 사람과의 의미를 완성하는 여정을 돕습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-16">" 탄생 배경은 단순했습니다. "</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            바쁜 일정 속에서도 중요한 사람과의 식사를 완벽히 준비하고 싶은 고객들의 니즈.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            예약이 어려운 유명 레스토랑, 까다로운 절차, 놓치기 쉬운 특별한 날들.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-16">
            우리는 이 모든 ‘복잡함’을 단 하나의 ‘경험’으로 바꾸기로 했습니다.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4"><span className="text-red-700">EIE Concierge</span> 의 핵심 가치</h3>
          <ul className="list-disc list-inside leading-8 text-lg text-gray-700 mb-10">
            <li><strong>Exclusivity (희소성)</strong></li>
            <li><strong>Inspire (감동적 가치)</strong></li>
            <li><strong>Experience (완전한 경험의 설계)</strong></li>
          </ul>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            EIE Concierge 는 세상에 단 하나뿐인 ‘맞춤형 미식 여정’을 디자인합니다.
          </p>
        </div>

        <div className="text-center mt-24">
          <p className="text-2xl font-bold text-gray-900 mb-10">오늘, 가장 특별한 순간을 위해, <span className=" text-red-700"> EIE Concierge</span> 가 함께합니다.</p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 text-center py-11">
        <blockquote className="mt-6 text-lg font-medium mb-10 leading-8 pl-4">
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

export default BrandStory;
