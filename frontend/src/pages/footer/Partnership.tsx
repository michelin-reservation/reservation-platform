import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";
import {ChevronRightCircle} from "lucide-react";

const Partnership = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <Header />
    
      {/* 이미지 섹션 추가 */}
      <section
        className="w-full relative bg-black"
        style={{
          backgroundImage: `url(https://png.pngtree.com/background/20231101/original/pngtree-intimate-dining-experience-a-3d-render-of-a-table-for-two-picture-image_5828638.jpg)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '320px',
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
          {/* 필요하면 여기에 텍스트나 콘텐츠 추가 */}
          <div>
            <h1 className="text-4xl text-center font-semibold text-[#FAFAF9] mb-4">
              파트너십 안내
            </h1>
            
          </div>
          {/* <h2 className="text-white text-2xl font-bold">프리미엄 다이닝의 순간</h2> */}
        </div>
      </section>
      <div className="w-full text-center px-4 py-10 bg-neutral-200">
        <p className="text-lg text-gray-800 font-serif font-medium leading-10 mt-6 mb-6">
          <span className="text-2xl text-red-700 font-bold">EIE Concierge</span> 는 고급 외식 경험을 함께 만들어갈 파트너를 기다립니다.
        </p>
        <p className="text-lg text-gray-800 font-serif font-medium mb-2">
          우리는 누구보다 손쉽고 완벽하게 연결해주는 고급 외식 컨시어지 플랫폼입니다.
        </p>
        <p className="text-lg text-gray-800 font-serif font-bold mb-10">
          이 여정을 함께 할 파트너에게 단순한 협업을 넘어, 고객 만족과 브랜드 가치의 극대화를 함께 추구하는 전략적 연계를 약속드립니다.
        </p>
      </div>

      {/* 협력 분야 섹션 */}
      <section className="py-16 bg-gray-100 w-full">
        <h2 className="text-2xl font-semibold text-center mb-8">협력 분야</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {[
            {
              title: "호텔",
              description: "투숙객 대상 고급 외식 패키지 제공",
              image: "https://previews.123rf.com/images/sanek13744/sanek137441701/sanek13744170100256/70186636-hotel-icon-on-isolated-background-simple-flat-pictogram-for-business-marketing-internet-concept.jpg",
            },
            {
              title: "카드사",
              description: "VIP 고객 전용 외식 특전",
              image: "https://png.pngtree.com/png-vector/20190216/ourlarge/pngtree-vector-credit-card-icon-png-image_541801.jpg",
            },
            {
              title: "고급 차량 의전사",
              description: "외식 전후의 품격 있는 이동 서비스 연계",
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-kU_V-6OrHZeU9yEN-ABAtXNe_KjU16rM9w&s",
            },
            {
              title: "와인 유통/소믈리에 기업",
              description: "와인 페어링 외식 패키지 제휴",
              image: "https://cdn-icons-png.flaticon.com/512/5231/5231925.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 mb-4 rounded-full"
              />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <h2 className="text-2xl font-semibold text-center mb-8">파트너 혜택</h2>
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          {[
            {
              benefit: "브랜드 공동 노출 및 마케팅 협력",
              detail: "파트너 브랜드와 함께 공동 마케팅을 진행합니다.",
            },
            {
              benefit: "VIP 타겟 기반 고객 유입 효과",
              detail: "VIP 고객을 타겟으로 한 높은 전환율을 기대하세요.",
            },
            {
              benefit: "단독 특전 및 이벤트 우선 제안",
              detail: "파트너만을 위한 독점 혜택과 이벤트 기획이 가능합니다.",
            },
            {
              benefit: "컨시어지 기반 맞춤형 서비스 기획 공동 개발",
              detail: "파트너와 협력하여 차별화된 고객 서비스를 제공합니다.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl shadow-md p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2">{item.benefit}</h3>
              <p className="text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-neutral-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-10">제휴 절차</h2>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              {
                step: "가입",
                description: "플랫폼 회원으로 가입하세요.",
              },
              {
                step: "협의",
                description: "파트너십 조건을 논의합니다.",
              },
              {
                step: "계약",
                description: "제휴 계약을 체결합니다.",
              },
              {
                step: "서비스 시작",
                description: "파트너십을 시작하세요!",
              },
            ].map((item, index, array) => (
              <React.Fragment key={index}>
                <div
                  className="bg-gray-50 rounded-lg shadow-md px-4 py-8 flex flex-col items-center text-center"
                >
                  <h3 className="text-lg font-bold mb-4">
                    {item.step}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < array.length - 1 && (
                  <ChevronRightCircle className="w-8 h-8 text-gray-500" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>;

    
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
           브랜드 소개
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/customer-support/service-guide')}
          >
            제휴 문의 안내
          </button>
          <button
            className="bg-white text-gray-900 font-bold text-base rounded-lg py-4 px-9 hover:bg-red-700 hover:text-white transition"
            onClick={() => navigate('/footer/service-contents/membership')}
          >
            파트너 전용 로그인
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

export default Partnership;
