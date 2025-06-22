import React, { useState } from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CookiePolicy: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const [cookieSettings, setCookieSettings] = useState({
    functionCookies: false,
    analysisCookies: false,
    marketingCookies: false,
  });

  // 토글 상태 업데이트 함수
  const handleToggle = (key: keyof typeof cookieSettings) => {
    setCookieSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 저장 버튼 클릭 시 처리
  const handleSave = () => {
    console.log("저장된 쿠키 설정:", cookieSettings);
    setShowModal(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-16 mb-16">쿠키 설정</h1> 
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">1. 쿠키 사용 목적</h2>
          <p className="text-gray-600">
            EIE Concierge는 고객의 웹사이트 이용 경험을 향상시키고, 개인 맞춤형 외식 제안을 제공하기 위해 쿠키를 사용합니다. 쿠키는 사용자의 장치에 저장되는 작은 데이터 파일로, 웹사이트의 기본 기능 및 마케팅 분석에 활용됩니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">2. 쿠키의 종류 및 설명</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">쿠키 유형</th>
                <th className="border border-gray-300 px-4 py-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">필수 쿠키</td>
                <td className="border border-gray-300 px-4 py-2">서비스 이용에 반드시 필요한 쿠키로, 로그인 유지, 예약 절차 처리 등 핵심 기능에 사용됩니다.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">기능 쿠키</td>
                <td className="border border-gray-300 px-4 py-2">사용자의 선택을 기억하여 더 개인화된 서비스를 제공 (예: 지역 선호 레스토랑 표시)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">분석 쿠키</td>
                <td className="border border-gray-300 px-4 py-2">웹사이트 사용 방식에 대한 데이터를 수집하여, 서비스 개선과 사용자 경험 향상에 활용됩니다.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">마케팅 쿠키</td>
                <td className="border border-gray-300 px-4 py-2">관심 기반 맞춤형 마케팅 및 광고 제공에 사용됩니다. <br />
                <span className="leading-relaxed">제휴 카드사와의 마케팅 효율 분석도 포함됩니다.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">3. 쿠키 동의 및 설정</h2>
          <p className="text-gray-600 mb-4">
            EIE Concierge 는 사용자가 쿠키 설정을 직접 관리할 수 있도록 아래와 같은 기능을 제공합니다.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li className="mb-3">모든 쿠키 허용</li>
            <li className="mb-3">선택적 쿠키만 허용</li>
            <li className="mb-3">모든 쿠키 거부</li>
            <li className="mb-3">쿠키 설정 상세 보기 및 편집</li>
          </ul>
          <p className="mt-4 text-gray-600">
            쿠키 설정은 언제든지 EIE Concierge 웹사이트 하단의 [쿠키 설정 관리] 창에서 변경 가능합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">4. 쿠키 저장 기간</h2>
          <p className="text-gray-600">
            쿠키는 목적에 따라 일정 기간 저장되며, 사용자 브라우저 설정 또는 쿠키 만료 시 자동 삭제됩니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">5. 제3자 제공 관련</h2>
          <p className="text-gray-600 mb-20">
            EIE Concierge 는 일부 제휴 마케팅 서비스(예: Google Analytics, Meta Pixel)를 통해 수집된 정보를 기반으로 광고 효율을 분석할 수 있으며, 이 경우에도 사용자의 사전 동의 없이 개인정보가 제공되거나 판매되지 않습니다.
          </p>
        </section>

        <div className="flex justify-center mb-12">
          <button
            className="bg-gray-700 hover:bg-red-700 text-white text-lg font-semibold py-3 px-8 rounded-3xl shadow transition"
            onClick={() => setShowModal(true)}
          >
            쿠키 설정 관리
          </button>
        </div>

        {/* 모달 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 border border-blue-100 relative">
              {/* 닫기 버튼 */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="닫기"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-red-800 mb-6">쿠키 설정</h2>

              {/* 필수 쿠키 */}
              <div className="mb-6 bg-stone-50 border border-gray-400 rounded-lg p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">필수 쿠키</span>
                  <span className="text-blue-800 font-semibold text-sm">항상 허용</span>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                  <li>웹사이트의 안전한 활용, 예약 등 주요 기능 제공</li>
                  <li>비활성화 불가, 정보는 제3자에게 공유·판매되지 않음</li>
                </ul>
              </div>

              {/* 기능 쿠키 */}
              <div className="mb-6 border-b border-gray-300 pb-6 px-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">기능 쿠키</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={cookieSettings.functionCookies}
                      onChange={() => handleToggle("functionCookies")} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-700 transition"></div>
                    <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full peer-checked:translate-x-5 transition"></div>
                  </label>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                  <li>웹사이트 이용 데이터 분석 및 서비스 개선</li>
                  <li>수집 정보는 익명으로 사용, 제3자에게 공유·판매되지 않음</li>
                </ul>
              </div>

              {/* 분석 쿠키 */}
              <div className="mb-6 border-b border-gray-300 pb-6 px-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">분석 쿠키</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={cookieSettings.analysisCookies}
                      onChange={() => handleToggle("analysisCookies")} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-700 transition"></div>
                    <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full peer-checked:translate-x-5 transition"></div>
                  </label>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                  <li>맞춤형 콘텐츠 및 서비스 제공</li>
                  <li>비활성화 시 맞춤형 서비스 제공 불가</li>
                </ul>
              </div>

              {/* 마케팅 쿠키 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2 px-6">
                  <span className="font-semibold text-gray-900">마케팅 쿠키</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={cookieSettings.marketingCookies}
                      onChange={() => handleToggle("marketingCookies")} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-700 transition"></div>
                    <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full peer-checked:translate-x-5 transition"></div>
                  </label>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1 px-6">
                  <li>마케팅 효과 측정 및 관련 콘텐츠 제공</li>
                  <li>수집 정보는 익명으로 표시</li>
                </ul>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-center">
                <button
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg shadow transition"
                  onClick={handleSave}
                >
                  동의 저장
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    <Footer />
    </div>
  );
};

export default CookiePolicy;
