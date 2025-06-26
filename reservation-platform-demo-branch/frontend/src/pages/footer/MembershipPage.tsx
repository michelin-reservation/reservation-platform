import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";
import { Check, Crown, User } from "lucide-react";

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const memberships = [
    {
      title: "Basic",
      subtitle: "무료 회원",
      description: [
        "누구나 무료로 가입 가능",
        "미슐랭 레스토랑 리스트 열람 가능",
        "일반 예약 가능 (제한적 제공)",
        "EIE 뉴스레터 수신",
      ],
      additionalInfo: "기본적인 서비스에 충실하며, 미슐랭 가이드 레스토랑에 대한 정보를 쉽게 얻을 수 있는 등급입니다.",
      borderColor: "border-gray-800",
      type: "basic",
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
      type: "vip",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">멤버십 안내</h1>
      </div>
      <div className="mt-12 container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:gap-x-2 gap-y-6 mb-10">
          {memberships.map((membership, index) => {
            const isVIP = membership.type === "vip";
            return (
              <div
                key={index}
                className={`
                  bg-white border-4
                  ${isVIP ? "border-red-700" : "border-gray-800"}
                  shadow-lg rounded-2xl p-8 flex flex-col justify-between
                  hover:bg-gray-50 transition-all duration-300
                  min-h-[480px] w-full max-w-md
                `}
              >
                {/* 카드 상단 뱃지/아이콘 */}
                <div className="flex justify-center items-center mb-4">
                  {isVIP ? (
                    <Crown className="w-9 h-9 text-yellow-500 mr-3" />
                  ) : (
                    <User className="w-9 h-9 text-gray-500 mr-2" />
                  )}
                  <span className={`text-3xl font-serif font-bold ${isVIP ? "text-red-700" : "text-gray-700"}`}>
                    {membership.title}
                  </span>
                </div>
                <h3 className={`text-lg font-medium text-center mb-4`}>
                  {membership.subtitle}
                </h3>
                <hr className={`${isVIP ? "border-red-300" : "border-gray-400"} mb-6`} />
                <ul className="mb-4 text-gray-700 space-y-3">
                  {membership.description.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={isVIP ? "text-red-700 w-5 h-5 mt-1" : "text-gray-700 w-5 h-5 mt-1"} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <hr className={`${isVIP ? "border-red-200" : "border-gray-200"}`} />
                <p className={`mt-4 text-gray-600 text-center font-medium`}>
                  {membership.additionalInfo}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mb-20">
          <button
            className="bg-red-700 text-white font-bold text-base rounded-lg py-4 px-12 hover:bg-red-800 transition"
            onClick={() => navigate('/register')}
          >
           멤버십 가입하기
          </button>
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
            onClick={() => navigate('/footer/customer-support/service-guide')}
          >
            서비스 이용 가이드 보기
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/service-contents/vip-services')}
          >
            VIP 전용 서비스 자세히 보기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MembershipPage;
