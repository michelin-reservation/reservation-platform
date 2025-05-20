import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('regular');

  if (!isOpen) return null;

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

          <Tabs.Content value="regular">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이디 또는 전화번호
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                로그인
              </button>
              <div className="flex justify-between text-sm text-gray-600">
                <button className="hover:text-red-600">비밀번호 찾기</button>
                <button className="hover:text-red-600">아이디 찾기</button>
                <button className="hover:text-red-600">회원가입</button>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="vip">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이디 또는 전화번호
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VISA 카드 인증
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="카드 번호"
                />
              </div>
              <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                로그인
              </button>
              <div className="flex justify-between text-sm text-gray-600">
                <button className="hover:text-red-600">비밀번호 찾기</button>
                <button className="hover:text-red-600">아이디 찾기</button>
                <button className="hover:text-red-600">회원가입</button>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="business">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사업자 등록번호
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                로그인
              </button>
              <div className="flex justify-between text-sm text-gray-600">
                <button className="hover:text-red-600">비밀번호 찾기</button>
                <button className="hover:text-red-600">사업자 등록</button>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default LoginModal;