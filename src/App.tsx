import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantPage from './pages/RestaurantPage';
import ConciergeServices from './pages/ConciergeServices';
import BusinessDashboard from './pages/BusinessDashboard';
import UserDashboard from './pages/UserDashboard';
import VipDashboard from './pages/VipDashboard';
import RegisterPage from './pages/RegisterPage';
import MenuManagement from './pages/business/MenuManagement';
import NoticeManagement from './pages/business/NoticeManagement';
import RestaurantSettings from './pages/business/RestaurantSettings';
import HelpSupport from './pages/business/HelpSupport';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/concierge" element={<ConciergeServices />} />
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/menu" element={<MenuManagement />} />
          <Route path="/business/notices" element={<NoticeManagement />} />
          <Route path="/business/settings" element={<RestaurantSettings />} />
          <Route path="/business/help" element={<HelpSupport />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/vip-dashboard" element={<VipDashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;