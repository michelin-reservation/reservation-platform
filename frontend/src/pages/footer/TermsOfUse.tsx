import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';


const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-16 mb-16">이용약관</h1>
      </div>
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-xl font-semibold mt-16 mb-4">제1조 (목적)</h2>
          <p>
            이 약관은 (주) EIE (이하 " <span className="font-serif font-medium">EIE</span> ")가 제공하는 프리미엄 외식
            컨시어지 플랫폼(웹사이트 및 앱 포함)의 이용과 관련하여 회사와
            이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제2조 (정의)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>“ <span className="font-serif font-medium">EIE</span> ”란 회사가 제공하는 미슐랭 레스토랑 예약 등 고급 외식 컨시어지 서비스를 의미합니다.</li>
            <li>“이용자”란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 VIP 회원을 말합니다.</li>
            <li>“제휴 카드사”란 본 서비스를 공동으로 운영하거나 혜택을 제공하는 계약 관계의 카드사를 말합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제3조 (이용계약의 성립)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>이용계약은 이용자가 본 약관에 동의한 후 회사가 승낙함으로써 성립됩니다.</li>
            <li>제휴 카드사의 회원 인증 절차를 통해 자격 여부를 확인할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제4조 (서비스 내용)</h2>
          <p>회사는 다음 각 호의 서비스를 제공합니다.</p>
          <ul className="mt-4 list-disc ml-6 space-y-2">
            <li>미쉐린급 고급 레스토랑 예약 대행</li>
            <li>와인 페어링 및 코스 추천 컨설팅</li>
            <li>프리미엄 차량 연계 예약 서비스</li>
            <li>제휴 호텔 및 카드 혜택 연동 안내</li>
          </ul>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제5조 (예약 및 변경)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>모든 예약은 EIE 플랫폼 또는 제휴사 경로를 통해 신청할 수 있습니다.</li>
            <li>예약 확정은 레스토랑의 승인을 기준으로 하며, 일부 예약은 사전 심사가 필요할 수 있습니다.</li>
            <li>예약 취소 및 변경은 회사가 정한 정책에 따릅니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제6조 (이용자의 의무)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>이용자는 서비스 이용 시 허위 정보를 기재하거나 타인의 정보를 도용해서는 안 됩니다.</li>
            <li>VIP 서비스를 남용하거나 타인에게 양도하는 행위는 금지됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제7조 (면책 조항)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>회사는 레스토랑 측 사정으로 인한 예약 불가에 대해 책임을 지지 않습니다.</li>
            <li>이용자의 귀책 사유로 인한 손해에 대해서는 책임을 지지 않습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제8조 (지적재산권)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>서비스 내 모든 콘텐츠 및 정보의 저작권은 회사에 귀속됩니다.</li>
            <li>이용자는 회사의 명시적 사전 동의 없이 이를 복제, 배포, 이용할 수 없습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mt-10 text-xl font-semibold mb-4">제9조 (약관의 변경)</h2>
          <p className="mb-20">
            회사는 관련 법령을 준수하여 본 약관을 변경할 수 있으며, 변경 사항은
            홈페이지 공지 또는 이메일로 안내합니다.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </div>
    
  );
};

export default TermsOfUse;
