import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, User } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMyPage = () => {
    if (user?.type === 'business') {
      navigate('/business');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-red-700  font-serif font-bold text-2xl tracking-tight">
          EIE
        </Link>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 focus:outline-none"
          >
            <MenuIcon size={24} />
          </button>
        </div>
        
        <nav className={`${isMenuOpen ? 'block absolute top-16 left-0 right-0 bg-white shadow-md p-4' : 'hidden'} md:block md:static md:shadow-none md:p-0`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
            <li>
              <Link to="/" className="text-gray-700 hover:text-red-700 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/restaurants" className="text-gray-700 hover:text-red-700 transition-colors">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/concierge" className="text-gray-700 hover:text-red-700 transition-colors">
                Concierge Services
              </Link>
            </li>
            <li>
              <Link to="/footer/customer-support/faq" className="text-gray-700 hover:text-red-700 transition-colors">
                FAQ
              </Link>
            </li>
            <li>
            </li>
          </ul>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <button
                onClick={handleMyPage}
                className="flex items-center text-gray-700 hover:text-red-700 transition-colors"
              >
                <User size={20} className="mr-1" />
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;