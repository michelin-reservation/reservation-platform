import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from "./components/ScrollToTop";
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import ConciergeServices from './pages/ConciergeServices';
import BusinessDashboard from './pages/BusinessDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterPage from './pages/RegisterPage';
import RestaurantsPage from './pages/RestaurantsPage';
import ReviewPage from './pages/ReviewPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import EditProfilePage from './pages/EditProfilePage';
import MenuManagement from './pages/business/MenuManagement';
import NoticeManagement from './pages/business/NoticeManagement';
import RestaurantSettings from './pages/business/RestaurantSettings';
import HelpSupport from './pages/business/HelpSupport';
import AboutEIE from './pages/footer/AboutEIE';
import BrandStory from './pages/footer/BrandStory';
import Partnership from './pages/footer/Partnership';
import PrivacyPolicy from './pages/footer/PrivacyPolicy';
import TermsOfUse from './pages/footer/TermsOfUse';
import TermsOfPayment from './pages/footer/TermsOfPayment';
import CookiePolicy from './pages/footer/CookiePolicy';
import FAQPage from './pages/footer/FAQPage';
import ServiceGuide from './pages/footer/ServiceGuide';
import MembershipPage from './pages/footer/MembershipPage';
import VIPServices from './pages/footer/VIPServices';
import Notice from './pages/footer/Notice';

function App() {
  return (
    <AuthProvider>
      <Router>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/concierge" element={<ConciergeServices />} />
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/review/:restaurantId" element={<ReviewPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/notifications" element={<NotificationSettingsPage />} />
          <Route path="/profile" element={<EditProfilePage />} />
          <Route path="/business/menu" element={<MenuManagement />} />
          <Route path="/business/notices" element={<NoticeManagement />} />
          <Route path="/business/settings" element={<RestaurantSettings />} />
          <Route path="/business/help" element={<HelpSupport />} />
          <Route path="/footer/about-us/aboutEIEConcierge" element={<AboutEIE />} />
          <Route path="/footer/about-us/brandstory" element={<BrandStory />} />
          <Route path="/footer/about-us/partnership" element={<Partnership/>} />
          <Route path="/footer/terms-and-policy/terms-of-use" element={<TermsOfUse />} />
          <Route path="/footer/terms-and-policy/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/footer/terms-and-policy/terms-of-payment" element={<TermsOfPayment />} />
          <Route path="/footer/terms-and-policy/cookie-policy" element={<CookiePolicy />} />
          <Route path="/footer/customer-support/notice" element={<Notice />} />
          <Route path="/footer/customer-support/faq" element={<FAQPage />} />
          <Route path="/footer/customer-support/service-guide" element={<ServiceGuide />} />
          <Route path="/footer/service-contents/membership" element={<MembershipPage />} />
          <Route path="/footer/service-contents/vip-services" element={<VIPServices />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;