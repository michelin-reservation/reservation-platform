import Header from '../../components/Header';
import Footer from '../../components/Footer';
import React from "react";
import { useNavigate } from "react-router-dom";

const AboutEIE = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 font-serif min-h-screen">
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%',
            height: '100%',
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="mt-6 text-3xl font-serif font-semibold mb-8 text-white">
            “ 당신의 식탁을 VIP로 만드는 단 하나의 컨시어지 ”
          </h1>
        </div>
      </section>

      <div className="w-full text-center px-4 py-10 bg-gray-100">
        <p className="text-lg text-gray-800 font-serif font-medium leading-10 mt-6 mb-6">
          <span className="text-2xl text-red-700 font-bold">EIE Concierge</span> 는<br /> ‘예약 불가’라 알려진 미슐랭급 프리미엄 레스토랑의 식사 경험을 <br />
          누구보다 손쉽고 완벽하게 연결해주는 고급 외식 컨시어지 플랫폼입니다.<br />
        </p>
        <p className="text-lg text-gray-800 font-serif font-bold mb-10">
          우리는 고객의 시간을 절약하고, 기억에 남을 미식 경험을 선사하는 것을 목표로 합니다.
        </p>
      </div>

      {/* Core Values Section */}
      <section className="bg-white font-serif w-full">
        <div className="max-w-6xl mx-auto px-8 py-9">
          <h2 className="mt-8 text-2xl font-semibold mb-12 text-[#2b3a4a] text-center">
            EIE Concierge 의 핵심 가치
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
            {/* Exclusivity */}
            <div className="flex-1 bg-stone-100 rounded-xl p-8 text-center max-w-md mx-auto">
              <div className="text-xl font-bold mb-2">
                <b className="text-red-700">E</b>xclusivity
              </div>
              <div className="text-sm text-gray-700 mb-4">(희소성)</div>
              <div className="text-base leading-6">
                오직 소수만을 위한,<br />프라이빗한 외식 컨시어지 혜택을 <br />제공합니다.
              </div>
            </div>
            {/* Inspire */}
            <div className="flex-1 bg-stone-100 rounded-xl p-8 text-center max-w-md mx-auto">
              <div className="text-xl font-bold mb-2">
                <b className="text-red-700">I</b>nspire
              </div>
              <div className="text-sm text-gray-700 mb-4">(감동적 가치)</div>
              <div className="text-base leading-6">
                AI 기반 추천과 맞춤형 예약으로 <br />고객 취향에 완벽하게 대응합니다.
              </div>
            </div>
            {/* Experience */}
            <div className="flex-1 bg-stone-100 rounded-xl p-8 text-center max-w-md mx-auto">
              <div className="text-xl font-bold mb-2">
                <b className="text-red-700">E</b>xperience
              </div>
              <div className="text-sm text-gray-700 mb-2">(완전한 경험의 설계)</div>
              <div className="text-base leading-6">
                단순한 외식이 아닌 <br /> ‘ 기억에 남는 미식 여정 ’을 설계하는<br /> 가치 중심의 서비스를 제공합니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Target Customers Section */}
      <section className="bg-gray-100 font-serif w-full">
        <div className="max-w-2xl mx-auto px-16 py-8">
          <h3 className="mt-10 text-xl font-bold mb-6 text-[#2b3a4a]">
            우리는 이런 고객을 위해 존재합니다.
          </h3>
          <ul className="pl-5 text-base font-semibold text-[#3d4c5c] leading-10 mb-10 list-disc">
            <li>특별한 날을 위한 식사를 찾는 고객</li>
            <li>기업 접대, 브랜드 행사 등 고급스러운 외식 연출이 필요한 고객</li>
            <li>채식, 오마카세, 유기농 fine-dining 등 관심 고객</li>
            <li>일상 속에서도 프리미엄 경험을 추구하는 고객</li>
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white font-serif w-full">
        <div className="max-w-2xl mx-auto px-16 py-9">
          <h3 className="mt-10 text-xl font-bold mb-6 text-[#2b3a4a]">
            <span className="text-red-700">EIE Concierge</span> 와 함께라면
          </h3>
          <ul className="pl-5 text-[#3d4c5c] font-semibold leading-10 list-disc mb-10">
            <li>국내 미슐랭 및 핫플레이스의 예약을 대행합니다.</li>
            <li>외식과 연결된 프리미엄 차량 서비스를 제공합니다.</li>
            <li>와인 페어링, 전용 고객 응대 등 부가 맞춤 서비스를 제공합니다.</li>
          </ul>
        </div>
      </section>

      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 font-serif text-center py-11">
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

export default AboutEIE;
