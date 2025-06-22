import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('regular');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex mb-6 border-b">
            <Tabs.Trigger
              value="regular"
              className={`flex-1 py-2 text-center ${
                activeTab === 'regular'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600'
              }`}
            >
              일반 회원
            </Tabs.Trigger>
            <Tabs.Trigger
              value="vip"
              className={`flex-1 py-2 text-center ${
                activeTab === 'vip'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600'
              }`}
            >
              VIP 회원
            </Tabs.Trigger>
            <Tabs.Trigger
              value="business"
              className={`flex-1 py-2 text-center ${
                activeTab === 'business'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600'
              }`}
            >
              사업자 회원
            </Tabs.Trigger>
          </Tabs.List>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                로그인
              </button>
              <button
                type="button"
                className="w-full bg-[#2DB400] text-white py-2 rounded-md hover:opacity-90 transition-colors"
              >
                네이버로 로그인
              </button>
              <div className="flex justify-between text-sm text-gray-600">
                <button type="button" className="hover:text-red-600">
                  비밀번호 찾기
                </button>
                <button type="button" className="hover:text-red-600">
                  아이디 찾기
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="hover:text-red-600"
                >
                  회원가입
                </button>
              </div>
            </div>
          </form>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default LoginModal;