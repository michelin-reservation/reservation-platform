import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BookingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full text-center px-4 py-10 bg-stone-300">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8">예약 및 결제 정책</h1> 
      </div>
      <div className="max-w-4xl mx-auto">

        <section className="mt-16 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">1. 예약 대상</h2>
          <p className="text-gray-600 mb-2">
            - <span className="font-serif text-lg font-medium">EIE</span>는 <span className="font-medium">제휴 카드사의 VIP 회원</span>을 대상으로 한 프리미엄 외식 컨시어지 서비스입니다.
          </p>
          <p className="text-gray-600">
            - 예약은 <span className="font-medium">EIE 플랫폼</span>을 통해서만 신청하실 수 있으며, 사전 등록된 회원에 한해 가능합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">2. 예약 절차</h2>
          <ol className="list-decimal list-inside leading-8 text-gray-600">
            <li>고객은 앱/웹을 통해 원하는 레스토랑과 시간대를 선택합니다.</li>
            <li>선택된 내용과 함께 특이사항 및 요청사항을 기입합니다.</li>
            <li>예약 요청 후, 내부 확인 및 제휴처 승인 절차를 거쳐 최종 예약 확정 안내가 전달됩니다.</li>
            <li>예약 확정 시, 결제 페이지로 이동하며 결제 후 완료됩니다.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">3. 결제 정책</h2>
          <p className="text-gray-600 mb-2">- 모든 예약은 <span className="font-medium">선결제 원칙</span>에 따라 진행됩니다.</p>
          <p className="text-gray-600 mb-2">- 결제 수단은 <span className="font-medium">제휴 카드사 신용카드</span>로 한정됩니다.</p>
          <p className="text-gray-600">- 결제 완료 시 영수증 및 예약 확인서가 자동 발송됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">4. 취소 및 환불</h2>
          <ul className="list-disc list-inside leading-8 text-gray-600">
            <li>예약 취소는 <span className="font-medium">방문일 기준 72시간 전까지</span> 가능하며, 전액 환불됩니다.</li>
            <li>24~72시간 전 취소 시 <span className="font-medium">수수료 30% 공제</span> 후 환불됩니다.</li>
            <li>방문 24시간 이내 취소 또는 노쇼의 경우, <span className="font-medium">환불 불가</span>입니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">5. 예외 사항</h2>
          <p className="text-gray-600 mb-2">
            - 천재지변, 정부의 행정조치 등 불가항력적 사유로 인한 취소는 별도 협의 후 조정될 수 있습니다.
          </p>
          <p className="text-gray-600 mb-20">
            - 파트너 레스토랑의 사정으로 예약이 불가해질 경우, 고객에게 즉시 안내 및 대체 예약 또는 전액 환불이 제공됩니다.
          </p>
        </section>
    </div>
    <Footer />
    </div>
  );
};

export default BookingPolicy;
