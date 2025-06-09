import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Header from '../../components/Header';
import BusinessFooter from '../../components/BusinessFooter';

interface MenuItem {
  id: string;
  name: string;
  nameKorean: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  isVisible: boolean;
}

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Spicy Seogyonamnyeongbang Noodles',
      nameKorean: '매콤 서교난면방난면',
      price: 15000,
      description: '매콤한 양념과 쫄깃한 면발이 일품인 대표 메뉴',
      category: '면류',
      isAvailable: true,
      isVisible: true
    },
    {
      id: '2',
      name: 'Korean Beef Seolleongtang Noodles',
      nameKorean: '한우 설렁탕 난면',
      price: 12000,
      description: '진한 한우 육수와 면이 어우러진 깊은 맛',
      category: '면류',
      isAvailable: true,
      isVisible: true
    },
    {
      id: '3',
      name: 'Korean Beef Noodles',
      nameKorean: '한우난면',
      price: 13000,
      description: '프리미엄 한우로 만든 특별한 난면',
      category: '면류',
      isAvailable: false,
      isVisible: true
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    nameKorean: '',
    price: 0,
    description: '',
    category: '면류'
  });

  const categories = ['면류', '밥류', '사이드', '음료', '디저트'];

  const toggleAvailability = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const toggleVisibility = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const handleAddItem = () => {
    const item: MenuItem = {
      id: Date.now().toString(),
      ...newItem,
      isAvailable: true,
      isVisible: true
    };
    setMenuItems([...menuItems, item]);
    setNewItem({ name: '', nameKorean: '', price: 0, description: '', category: '면류' });
    setIsAddModalOpen(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      nameKorean: item.nameKorean,
      price: item.price,
      description: item.description,
      category: item.category
    });
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setMenuItems(items =>
        items.map(item =>
          item.id === editingItem.id ? { ...item, ...newItem } : item
        )
      );
      setEditingItem(null);
      setNewItem({ name: '', nameKorean: '', price: 0, description: '', category: '면류' });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
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
              <Link to="/business/menu" className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-600">메뉴 관리</Link>
              <Link to="/business/notices" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">공지/이벤트</Link>
              <Link to="/business/settings" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">설정</Link>
              <Link to="/business/help" className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">도움말</Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">메뉴 관리</h1>
          <p className="text-red-600 mt-1">메뉴 등록, 수정 및 품절 관리</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">메뉴 목록</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                메뉴 추가
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    메뉴명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.nameKorean}</div>
                        <div className="text-sm text-gray-500">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.price.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isAvailable ? '판매중' : '품절'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.isVisible 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.isVisible ? '표시' : '숨김'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className={`${item.isAvailable ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {item.isAvailable ? '품절' : '판매'}
                        </button>
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {item.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">
                {editingItem ? '메뉴 수정' : '메뉴 추가'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴명 (한글)
                  </label>
                  <input
                    type="text"
                    value={newItem.nameKorean}
                    onChange={(e) => setNewItem({ ...newItem, nameKorean: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="한글 메뉴명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴명 (영문)
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="영문 메뉴명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가격
                  </label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="가격을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="메뉴 설명을 입력하세요"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingItem(null);
                      setNewItem({ name: '', nameKorean: '', price: 0, description: '', category: '면류' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    취소
                  </button>
                  <button
                    onClick={editingItem ? handleUpdateItem : handleAddItem}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingItem ? '수정하기' : '추가하기'}
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

export default MenuManagement; 