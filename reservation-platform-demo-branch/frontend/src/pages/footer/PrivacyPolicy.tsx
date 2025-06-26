import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">개인정보 처리방침</h1> 
      </div>
      <div className="max-w-4xl mx-auto">
      <p className="text-lg text-center mt-10 mb-20">
        (주) EIE (이하 “ <span className="font-serif font-medium">EIE</span> ”)는 고객님의 개인정보를 소중히 여기며, 『개인정보 보호법』 등 관련 법령을
        준수합니다. 회사는 개인정보 처리방침을 통해 고객님이 제공하신 개인정보가 어떠한 용도와 방식으로
        이용되고 있으며, 보호를 위해 어떤 조치를 취하고 있는지 안내 드립니다.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. 수집하는 개인정보 항목 및 수집방법</h2>
        <p className="mb-4">
          회사는 회원가입, 제휴 서비스 이용, 고객 상담 등을 위해 아래와 같은 정보를 수집할 수 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <span className="font-bold">필수 항목:</span> 성명, 연락처, 이메일 주소, 카드사 제휴 여부, 로그인 정보
          </li>
          <li>
            <span className="font-bold">선택 항목:</span> 생년월일, 성별, 예약 선호도, 특이사항
          </li>
          <li>
            <span className="font-bold">자동 수집 정보:</span> 접속 IP, 쿠키, 접속기록, 기기 정보 등
          </li>
        </ul>
        <p>※ 회사는 만 14세 미만 아동의 개인정보를 수집하지 않습니다.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 수집 및 이용 목적</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>회원 서비스 제공 및 본인 확인</li>
          <li>미슐랭 레스토랑 예약 및 의전 차량 매칭 등 컨시어지 서비스 제공</li>
          <li>카드사 VIP 인증 및 혜택 제공</li>
          <li>고객 문의 및 불만 처리</li>
          <li>서비스 품질 향상 및 마케팅 정보 제공 (선택 동의 시)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. 개인정보 보유 및 이용기간</h2>
        <p className="mb-4">
          원칙적으로 개인정보 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 단, 상법 등 관계법령의 규정에
          의하여 보존할 필요가 있는 경우 일정 기간 보관할 수 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>계약 또는 청약철회 기록: 5년</li>
          <li>고객 불만 또는 분쟁 처리 기록: 3년</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
        <p className="mb-4">
          회사는 이용자의 사전 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>고객 요청에 따라 제휴된 카드사 또는 호텔/레스토랑에 예약 정보 전달 시</li>
          <li>법령의 규정에 따른 경우 (수사기관의 정식 요청 등)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. 개인정보 처리의 위탁</h2>
        <p className="mb-4">
          회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리를 위탁할 수 있습니다.
        </p>
        <table className="table-auto w-full text-left border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">수탁업체</th>
              <th className="p-2 border">위탁업무 내용</th>
              <th className="p-2 border">보유 및 이용기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">NICE 평가정보</td>
              <td className="p-2 border">본인 인증 서비스</td>
              <td className="p-2 border">위탁 계약 종료 시까지</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. 개인정보 파기 절차 및 방법</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-bold">파기 절차:</span> 목적 달성 후 별도 저장 후 즉시 파기
          </li>
          <li>
            <span className="font-bold">파기 방법:</span> 전자 파일은 복구 불가능한 방법으로 삭제, 출력물은 분쇄 또는
            소각
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. 정보주체의 권리 및 행사방법</h2>
        <p>
          개인정보 열람, 정정, 삭제, 처리정지 요구가 가능하며, 권리 행사는 EIE 웹사이트 또는 고객센터를 통해
          가능합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. 개인정보 보호 책임자</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-bold">책임자:</span> 도유정
          </li>
          <li>
            <span className="font-bold">이메일:</span>{' '}
            <a
              href="mailto:privacy@eieconcierge.com"
              className="text-blue-600 underline hover:text-blue-800"
            >
              privacy@eieconcierge.com
            </a>
          </li>
          <li>
            <span className="font-bold">연락처:</span> 051-000-0000
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">9. 고지의 의무</h2>
        <p>
          이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 정책 변경 시 사전 고지 후 개정됩니다.
        </p>
        <p className="mt-4 font-bold mb-20">시행일자: 2025년 6월 26일</p>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default PrivacyPolicy;
