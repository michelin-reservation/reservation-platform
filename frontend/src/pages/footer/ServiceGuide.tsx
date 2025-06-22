import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";
import { Mail, Clock, Info, Search, CheckCircle } from "lucide-react";

const ServicePage = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "프리미엄 예약 대행",
      description:
        "고객님의 소중한 하루를 위해, 전국 미슐랭 레스토랑 예약을 단 한 번의 클릭으로, EIE는 예약 요청부터 확정까지 모든 과정을 대신 처리합니다.",
    },
    {
      title: "카드사 VIP 고객만을 위한 전용 서비스",
      description:
        "삼성/신한/현대카드 등 지정된 카드 VIP 고객에 한해 EIE Concierge 전용 혜택이 제공됩니다.",
    },
    {
      title: "맞춤형 외식 큐레이션",
      description:
        "기념일, 접대, 가족 모임 등 다양한 외식 목적에 맞춰 메뉴/분위기/가격대를 기준으로 최적의 식당을 제안해드립니다.",
    },
    {
      title: "단체 행사 및 브랜드 컨설팅",
      description:
        "브랜드 런칭, 기자 간담회, 소규모 웨딩까지, 외식 공간이 필요한 다양한 상황에 맞는 예약 및 컨시어지 서비스를 제공합니다.",
    },
    {
      title: "예약 실패 시 대안까지",
      description:
        "희망 시간대 예약이 어려운 경우, 고객 요청에 맞춘 유사한 대안을 1:1로 상담해 드립니다. 성공률 높은 예약을 위해 식당별 선호도, 피크타임 정보도 함께 안내합니다.",
    },
    {
      title: "실시간 예약 요청 및 확인",
      description:
        "고객은 웹페이지 및 앱에서 원하는 식당, 날짜, 인원 정보를 입력하기만 하면 끝! 담당 매니저가 신속하게 예약 가능 여부를 안내해드립니다.",
    },
  ];

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-16 bg-stone-300">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">서비스 이용 가이드</h1>
      </div>

      {/* 섹션 1 */}
      <section className="w-full py-16 text-center bg-gray-100">
        <p className="text-lg font-medium max-w-6xl leading-10 mx-auto">
          <span className="text-red-700 font-bold">EIE Concierge</span> 는 카드사 VIP 고객을 위한 <strong>프리미엄 미슐랭 레스토랑 예약 대행 컨시어지 플랫폼</strong>입니다.<br />
          복잡한 예약 절차 없이, 클릭 한 번으로 특별한 외식 경험을 누릴 수 있도록 설계되었습니다.
        </p>
      </section>

      {/* 서비스 안내 */}
      <div className="w-full py-16 bg-gray-50">
        <h1 className="text-2xl font-bold text-center mb-8">EIE Concierge 가 제공하는 서비스</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border-2 border-gray-500 text-center"
            >
              <h2 className="text-lg font-bold mb-4 text-red-800">{service.title}</h2>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 이용 대상 */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">이용 대상</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>제휴된 카드사의 VIP 고객</li>
            <li>카드사에서 발급한 <strong>전용 링크 혹은 초대 코드</strong> 보유 고객</li>
          </ul>
        </div>
      </section>

      {/* 서비스 이용 절차 */}
      <section className="w-full py-16 bg-neutral-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">서비스 이용 절차</h2>
          <div className="flex justify-between items-center gap-4">
          {[
            { icon: <Info size={48} />, text: "1. 로그인" },
            { icon: <Search size={48} />, text: "2. 레스토랑 검색" },
            { icon: <Clock size={48} />, text: "3. 예약 요청" },
            { icon: <CheckCircle size={48} />, text: "4. 예약 확정" },
            { icon: <Clock size={48} />, text: "5. 방문 및 이용" },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-500 mb-2">{step.icon}</div>
              <p className="text-sm font-medium">{step.text}</p>
            </div>
          ))}
          </div>
          <div className="mt-8 grid gap-4">
            {[
              "1 ) 카드사 전용 인증 절차를 통해 로그인",
              "2 ) 지역, 종류, 일정 등 필터를 통해 맞춤 검색",
              "3 ) 원하는 일시와 인원, 특이사항(알레르기, 자리 요청 등) 입력",
              "4 ) EIE 컨시어지가 확인 후 확정 메시지 발송",
              "5 ) 당일 현장 방문 및 VIP 응대 제공",
            ].map((description, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4 text-center">
                <p className="text-gray-700">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">예약 가능 시간 및 운영 시간</h2>
          <ul className="list-disc list-inside leading-10 text-lg text-gray-700">
            <li>예약 신청 : <strong>24시간 상시 접수</strong></li>
            <li>컨시어지 응대 및 예약 확정 : <strong>평일 오전 10시 ~ 오후 6시</strong></li>
            <li className="text-regular">주말/공휴일은 일부 딜레이될 수 있습니다.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-6">변경 및 취소 안내</h2>
          <ul className="list-disc list-inside leading-10 text-lg text-gray-700">
            <li>예약 변경은 <strong>확정 전까지</strong> 가능합니다.</li>
            <li>확정 이후 취소 시에는 <strong>레스토랑 정책에 따라 위약금</strong>이 발생할 수 있습니다.</li>
            <li>고객의 단순 변심에 의한 예약 반복 취소 시, 서비스 이용이 제한될 수 있습니다.</li>
          </ul>
        </div>
      </section>

      {/* 문의 및 고객센터 */}
      <section className="w-full py-16 text-center bg-white">
        <h2 className="text-xl font-semibold mb-4">문의 및 고객센터</h2>
        <p className="text-gray-700">1:1 문의하기 기능을 통해 고객센터에 문의 가능</p>
        <p className="text-gray-700">이메일 문의 지원 (<a href="mailto:support@eieconcierge.com" className="text-blue-600 underline">support@eieconcierge.com</a>)</p>
      </section>

      {/* CTA Section */}
      <div className="bg-gray-300 text-gray-800 text-center py-16">
        <blockquote className="text-lg font-medium mb-10 leading-4">
          <b>지금 " EIE Concierge " 와 함께하세요.</b>
        </blockquote>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
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

export default ServicePage;
