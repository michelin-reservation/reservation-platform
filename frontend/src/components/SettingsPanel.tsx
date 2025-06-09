import React from 'react';
import { Settings, Menu, Bell } from 'lucide-react';

interface SettingsPanelProps {
  onMenuClick?: () => void;
  onNoticeClick?: () => void;
  onSettingsClick?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onMenuClick,
  onNoticeClick,
  onSettingsClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Menu className="text-red-600 mr-2" size={20} />
          <h2 className="text-lg font-bold">메뉴 관리</h2>
        </div>
        <ul className="space-y-2">
          <li 
            className="text-gray-600 hover:text-red-600 cursor-pointer"
            onClick={onMenuClick}
          >
            메뉴 등록/수정
          </li>
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            가격 설정
          </li>
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            품절 관리
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Bell className="text-red-600 mr-2" size={20} />
          <h2 className="text-lg font-bold">공지/이벤트</h2>
        </div>
        <ul className="space-y-2">
          <li 
            className="text-gray-600 hover:text-red-600 cursor-pointer"
            onClick={onNoticeClick}
          >
            공지사항 등록
          </li>
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            이벤트 관리
          </li>
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            프로모션 설정
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Settings className="text-red-600 mr-2" size={20} />
          <h2 className="text-lg font-bold">설정</h2>
        </div>
        <ul className="space-y-2">
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            영업시간 설정
          </li>
          <li className="text-gray-600 hover:text-red-600 cursor-pointer">
            좌석 관리
          </li>
          <li 
            className="text-gray-600 hover:text-red-600 cursor-pointer"
            onClick={onSettingsClick}
          >
            알림 설정
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPanel; 