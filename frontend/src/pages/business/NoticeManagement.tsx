import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Bell } from 'lucide-react';
import Header from '../../components/Header';
import BusinessFooter from '../../components/BusinessFooter';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'promotion';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

const NoticeManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: '신메뉴 출시 안내',
      content: '새로운 시즌 메뉴가 출시되었습니다. 많은 관심 부탁드립니다.',
      type: 'notice',
      startDate: '2025-01-15',
      isActive: true,
      createdAt: '2025-01-15'
    },
    {
      id: '2',
      title: '설날 연휴 영업시간 변경',
      content: '설날 연휴 기간 중 영업시간이 변경됩니다.',
      type: 'notice',
      startDate: '2025-01-28',
      endDate: '2025-02-02',
      isActive: true,
      createdAt: '2025-01-20'
    },
    {
      id: '3',
      title: '런치 세트 할인 이벤트',
      content: '평일 런치 세트 20% 할인 이벤트를 진행합니다.',
      type: 'promotion',
      startDate: '2025-01-25',
      endDate: '2025-02-25',
      isActive: true,
      createdAt: '2025-01-25'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'notice' as 'notice' | 'event' | 'promotion',
    startDate: '',
    endDate: ''
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'notice': return '공지사항';
      case 'event': return '이벤트';
      case 'promotion': return '프로모션';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notice': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddNotice = () => {
    const notice: Notice = {
      id: Date.now().toString(),
      ...newNotice,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNotices([notice, ...notices]);
    setNewNotice({ title: '', content: '', type: 'notice', startDate: '', endDate: '' });
    setIsAddModalOpen(false);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setNewNotice({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      startDate: notice.startDate,
      endDate: notice.endDate || ''
    });
  };

  const handleUpdateNotice = () => {
    if (editingNotice) {
      setNotices(notices =>
        notices.map(notice =>
          notice.id === editingNotice.id ? { ...notice, ...newNotice } : notice
        )
      );
      setEditingNotice(null);
      setNewNotice({ title: '', content: '', type: 'notice', startDate: '', endDate: '' });
    }
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      setNotices(notices => notices.filter(notice => notice.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setNotices(notices =>
      notices.map(notice =>
        notice.id === id ? { ...notice, isActive: !notice.isActive } : notice
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link to="/business" className="inline-flex items-center text-gray-600 hover:text-red-600 mr-4">
              <ArrowLeft size={16} className="mr-1" />
              <span>대시보드로 돌아가기</span>
            </Link>
            <div className="flex space-x-2">
              <Link to="/business/menu" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">메뉴 관리</Link>
              <Link to="/business/notices" className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-600">공지/이벤트</Link>
              <Link to="/business/settings" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">설정</Link>
              <Link to="/business/help" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">도움말</Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">공지/이벤트 관리</h1>
          <p className="text-red-600 mt-1">공지사항, 이벤트, 프로모션 관리</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">공지사항 목록</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                공지사항 추가
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <div key={notice.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notice.type)}`}>
                        {getTypeLabel(notice.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notice.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 mb-3">{notice.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>시작: {notice.startDate}</span>
                      </div>
                      {notice.endDate && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>종료: {notice.endDate}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Bell size={14} className="mr-1" />
                        <span>등록: {notice.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditNotice(notice)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => toggleActive(notice.id)}
                      className={`p-2 ${notice.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {notice.isActive ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || editingNotice) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {editingNotice ? '공지사항 수정' : '공지사항 추가'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    유형
                  </label>
                  <select
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="notice">공지사항</option>
                    <option value="event">이벤트</option>
                    <option value="promotion">프로모션</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <textarea
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={newNotice.startDate}
                      onChange={(e) => setNewNotice({ ...newNotice, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      종료일 (선택사항)
                    </label>
                    <input
                      type="date"
                      value={newNotice.endDate}
                      onChange={(e) => setNewNotice({ ...newNotice, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingNotice(null);
                      setNewNotice({ title: '', content: '', type: 'notice', startDate: '', endDate: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    취소
                  </button>
                  <button
                    onClick={editingNotice ? handleUpdateNotice : handleAddNotice}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingNotice ? '수정하기' : '추가하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BusinessFooter />
    </div>
  );
};

export default NoticeManagement; 