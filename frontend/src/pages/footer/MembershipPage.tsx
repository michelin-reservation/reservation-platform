import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const memberships = [
    {
      title: "Basic",
      subtitle: "무료 회원",
      description: [
        "누구나 가입 가능",
        "미슐랭 레스토랑 리스트 열람 가능",
        "일반 예약 가능 (제한적 제공)",
        "EIE Concierge 뉴스레터 수신",
      ],
      additionalInfo: "기본적인 서비스에 충실하며, 미슐랭 가이드 레스토랑에 대한 정보를 쉽게 얻을 수 있는 등급입니다.",
      borderColor: "border-gray-800",
    },
    {
      title: "VIP",
      subtitle: "유료 회원 및 카드사 연계 VIP",
      description: [
        "전용 예약 창구 제공 (우선 배정)",
        "미슐랭 예약 성공률 상승",
        "프리미엄 외식 큐레이션 제공",
        "의전 차량 서비스 할인 제공",
        "한정 테마 프로모션 참여 가능",
      ],
      additionalInfo: "외식 경험의 품격을 높이고자 하는 분들을 위한 고급 멤버십입니다. 카드사와 연계된 특별 혜택도 누릴 수 있습니다.",
      borderColor: "border-red-700",
    },
    {
      title: "EIE Black",
      subtitle: "초청제 VIP 멤버십",
      description: [
        "Concierge 전담 매니저 배정",
        "미슐랭 풀북 레스토랑 우선 조율",
        "프라이빗 와인 페어링 컨설팅",
        "연 1회 EIE Experience 기획 제공 (호텔+레스토랑 패키지)",
        "기업 접대/이벤트 맞춤 운영 가능",
      ],
      additionalInfo: "최상의 경험과 혜택을 제공하는 초청제 멤버십으로, 프라이빗하고 독창적인 외식 서비스를 제공합니다.",
      borderColor: "border-yellow-700",
    },
  ];

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">멤버십 안내</h1> 
      </div>
      <div className="mt-12 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {memberships.map((membership, index) => (
            <div
              key={index}
              className={`bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between border-4 ${membership.borderColor} hover:bg-gray-50`}
            >
              <div>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                  {membership.title}
                </h2>
                <h3 className="text-lg font-medium text-center text-gray-600 mb-4">
                  {membership.subtitle}
                </h3>
                <hr className="border-gray-400 mb-6" />
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  {membership.description.map((item, idx) => (
                    <li key={idx} className="mb-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-center text-gray-500">
                {membership.additionalInfo}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 font-serif text-center py-11">
        <blockquote className="mt-6 text-lg font-medium mb-10 leading-4 pl-4">
          <b>지금 " EIE Concierge " 와 함께하세요.</b>
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
            onClick={() => navigate('/footer/service-contents/vip-services')}
          >
            VIP 전용 서비스 안내
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

export default MembershipPage;
