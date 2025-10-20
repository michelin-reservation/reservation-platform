import React, { useState } from "react";
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInquiryClick = () => {
    alert(
      "현재 1:1 문의 서비스는 준비 중에 있습니다.\n" +
      "문의가 급하신 경우, 고객센터(1588-0000 또는 contact@eieconcierge.com)로 연락해주시기 바랍니다.\n" +
      "감사합니다."
    );
  };

  return (
    <footer className="bg-stone-100 py-10">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 lg:grid-cols-6 gap-4 text-gray-700 mt-6">
          {/* Column 1 */}
          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">About Us</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/footer/about-us/about-eie" className="hover:text-red-600"> EIE 소개</Link>
              </li>
              <li>
                <Link to="/footer/about-us/brandstory" className="hover:text-red-600">브랜드 스토리</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">고객지원</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/footer/customer-support/notice" className="hover:text-red-600">공지사항</Link>
              </li>
              <li>
                <Link to="/footer/customer-support/faq" className="hover:text-red-600">자주 묻는 질문 (FAQ)</Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-bold hover:text-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    handleInquiryClick();
                  }}
                >
                  1:1 문의하기
                </a>
              </li>
              <li>
                <Link to="/footer/customer-support/service-guide" className="hover:text-red-600">서비스 이용 가이드</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">약관 및 규정</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/footer/terms-and-policy/terms-of-use" className="hover:text-red-600">이용약관</Link>
              </li>
              <li>
                <Link to="/footer/terms-and-policy/privacy-policy" className="text-gray-600 font-bold hover:text-red-600">개인정보 처리방침</Link>
              </li>
              <li>
                <Link to="/footer/terms-and-policy/terms-of-payment" className="hover:text-red-600">예약 및 결제 정책</Link>
              </li>
              <li>
                <Link to="/footer/terms-and-policy/cookie-policy" className="hover:text-red-600">쿠키 설정</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">서비스 안내</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/footer/service-contents/membership" className="hover:text-red-600">멤버십 안내</Link>
              </li>
              <li>
                <Link to="/footer/service-contents/vip-services" className="hover:text-red-600">VIP 전용 서비스 안내</Link>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">제휴 정보</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/footer/about-us/partnership" className="hover:text-red-600">파트너십 안내</Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal();
                  }}
                  className="hover:text-red-600"
                >
                  파트너 전용 로그인
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 6 */}
          {/* <div>
            <h2 className="text-gray-900 font-bold text-lg mb-4">EIE 앱 다운로드</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-red-600">App Store 다운로드</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600">Google Play 다운로드</a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="mt-10 border-t border-gray-300 pt-4 text-gray-600 leading-8 mt-20">
          <div className="mt-4 text-red-700 text-left font-serif font-bold text-2xl relativ mb-4">EIE</div>
          <p>(주) EIE</p>
          <p>대표: 이준영 | 사업자등록번호: 123-45-67890</p>
          <p>주소: 부산광역시 남구 수영로 298 산암빌딩 10층</p>
          <p>고객센터: 1588-0000 | contact@eieconcierge.com</p>
          <p className="mt-2">&copy; 2025 EIE. All Rights Reserved.</p>
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </footer>
  );
};

export default Footer;