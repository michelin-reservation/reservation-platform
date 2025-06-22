import React, { useState } from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const FAQPage = () => {
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("service");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const serviceFAQs = [
    {
      question: "Q . 예약은 어떻게 하나요?",
      answer:
        "EIE 앱 또는 웹사이트에서 원하는 레스토랑과 시간대를 선택하신 후, 맞춤 고객 서비스 항목을 입력하시면 간편하게 예약할 수 있습니다. 이후 내부 심사 절차를 거쳐 예약 확정 여부를 안내해드립니다.",
    },
    {
      question: "Q . 예약 확정은 언제 되나요?",
      answer:
        "예약 요청 후 평균 12시간 이내에 확정 여부를 알림 톡 또는 문자로 안내드립니다. 미확정 시 개별 상담이 진행됩니다.",
    },
    {
      question: "Q . 예약 변경 및 취소는 어떻게 하나요?",
      answer:
        "앱 내 ‘예약 내역’ 메뉴에서 변경 요청이 가능합니다. 레스토랑 정책에 따라 취소 수수료가 발생할 수 있습니다.",
    },
    {
      question: "Q . 미슐랭 레스토랑 예약은 모두 가능한가요?",
      answer:
        "서울과 부산 내 파트너 레스토랑은 지속적으로 확대 중이며, 비공개 레스토랑도 맞춤 컨시어지를 통해 별도 안내해 드립니다.",
    },
    {
      question: "Q . VIP 외식 예약 서비스는 어떤 기준으로 진행되나요?",
      answer:
        "EIE는 미슐랭 스타 레스토랑 및 노쇼 방지를 위한 사전 확정제 기반의 예약만을 운영합니다. 고객의 기호와 일정을 기반으로 최적의 레스토랑을 큐레이션합니다.",
    },
    {
      question: "Q . 예약은 고객이 직접 하나요, 아니면 대행하나요?",
      answer:
        "EIE가 전담으로 예약을 대행합니다. 고객은 희망 일정만 전달하면, 나머지는 저희가 모두 처리합니다.",
    },
    {
      question: "Q . 외식 이외에 다른 맞춤형 서비스도 제공하나요?",
      answer:
        "고객의 요구에 따라 맞춤형 파인 다이닝 체험, 프라이빗 룸 서비스, 와인 페어링 추천 등 부가 서비스를 포함해 제공합니다.",
    },
    {
      question: "Q . 컨시어지 서비스는 누구나 이용 가능한가요?",
      answer:
        "해당 서비스는 제휴된 카드사의 특정 등급 이상의 고객 대상으로 운영됩니다. 추후 개별 프리미엄 멤버십 가입자에게도 오픈 될 예정입니다.",
    },
  ];

  const collaborationFAQs = [
    {
      question: "Q . EIE와 제휴하거나 협업하고 싶으면 어떻게 해야 하나요?",
      answer:
        "EIE는 프리미엄 외식, 차량, 호텔, 카드사 등 다양한 분야와의 협업을 기다리고 있습니다. 제휴 제안은 [partners@eieconcierge.com](mailto:partners@eieconcierge.com)으로 이메일 주시면, 담당자가 최대 3영업일 이내에 회신 드립니다.",
    },
    {
      question: "Q . 제휴 시 어떤 혜택을 받을 수 있나요?",
      answer:
        "제휴 파트너사에게는 다음과 같은 혜택이 제공됩니다:\n- EIE 플랫폼 내 브랜드 노출\n- 고소득 VIP 타겟 대상 공동 마케팅\n- 앱 내 예약/이용 트래픽 분석 데이터 제공",
    },
    {
      question: "Q . 광고 집행이나 공동 프로모션은 어떤 방식으로 진행되나요?",
      answer:
        "웹 사이트, SNS, 오프라인 등과 같은 채널과 고객층에 따라 KPI 설정 및 리소스 분배를 협의하여 진행하며, 리포트도 투명하게 제공해드립니다.",
    },
    {
      question: "Q . 협업 가능 분야에는 무엇이 있나요?",
      answer:
        "다음과 같은 파트너십이 가능합니다:\n- 호텔/차량사: 프리미엄 패키지 구성 및 공동 프로모션\n- 식음료 브랜드: 미슐랭 식사 연계 와인 페어링, 디저트 제공 등\n- 카드사/보험사: 고객 혜택 연계 또는 프로모션 제휴",
    },
    {
      question: "Q . 정산은 어떻게 이루어지나요?",
      answer:
        "월간 기준으로 정산 리포트가 제공되며, 계약서 기반으로 송금 또는 수수료 정산 등의 방법을 선택하실 수 있습니다.",
    },
    {
      question: "Q . 단기 캠페인 협업도 가능한가요?",
      answer:
        "네, 가능합니다. 명절, 연말, 브랜드 론칭 등 특정 시즌을 위한 맞춤형 공동 캠페인을 함께 설계할 수 있습니다.",
    },
  ];

  const currentFAQs =
    activeTab === "service" ? serviceFAQs : collaborationFAQs;

  const filteredFAQs = currentFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearch = () => {
    console.log("검색어:", searchTerm); // 필요에 따라 검색어 처리
  };

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">자주 묻는 질문 (FAQ)</h1> 
      </div>
      <div className="p-6 max-w-6xl font-serif mx-auto">
      
        <div className="max-w-lg mt-6 mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

      <div className="flex space-x-0">
        <button
          className={`px-8 py-3 ${
            activeTab === "service" ? "bg-red-700 font-semibold text-white" : "bg-gray-200 font-bold"
          }`}
          onClick={() => setActiveTab("service")}
        >
          서비스 이용 관련
        </button>
        <button
          className={`px-8 py-3 ${
            activeTab === "collaboration" ? "bg-red-700 font-semibold text-white" : "bg-gray-200 font-bold"
          }`}
          onClick={() => setActiveTab("collaboration")}
        >
          제휴 및 협업 관련
        </button>
      </div>

      {/* FAQ 목록 */}
      <div className="space-y-0 mb-16">
        {filteredFAQs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-sm overflow-hidden bg-white"
          >
            <button
              className="w-full text-left px-6 py-5 flex justify-between items-center text-gray-800 font-semibold"
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              <span className="text-gray-500">
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>
            {openIndex === index && (
              <>
                <div className="border-t"></div>
                <div className="p-8 text-gray-700 font-semibold">{faq.answer}</div>
              </>
            )}
          </div>
        ))}
      </div>
      </div>
      {/* Final CTA Section */}
      <div className="bg-gray-300 text-gray-800 text-center py-11">
        <blockquote className="mt-6 text-lg font-medium mb-10 leading-4 pl-4">
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

export default FAQPage;
