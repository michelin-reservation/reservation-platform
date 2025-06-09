import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  nameKorean: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
}

const MenuManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    nameKorean: '',
    price: 0,
    description: '',
    category: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/menu');
      if (!response.ok) throw new Error('메뉴를 불러오지 못했습니다.');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('메뉴를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSave = async (item: MenuItem) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });

      if (!response.ok) throw new Error('메뉴를 저장하지 못했습니다.');

      setMenuItems(menuItems.map(i => (i.id === item.id ? item : i)));
      setEditingItem(null);
      setSuccess('메뉴가 저장되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('메뉴를 저장하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/business/menu/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('메뉴를 삭제하지 못했습니다.');

      setMenuItems(menuItems.filter(item => item.id !== id));
      setSuccess('메뉴가 삭제되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('메뉴를 삭제하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) throw new Error('메뉴를 추가하지 못했습니다.');

      const addedItem = await response.json();
      setMenuItems([...menuItems, addedItem]);
      setNewItem({
        name: '',
        nameKorean: '',
        price: 0,
        description: '',
        category: '',
        isAvailable: true
      });
      setSuccess('메뉴가 추가되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('메뉴를 추가하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">메뉴 관리</h1>

          {/* 새 메뉴 추가 폼 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">새 메뉴 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메뉴명 (영문)
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메뉴명 (한글)
                </label>
                <input
                  type="text"
                  value={newItem.nameKorean}
                  onChange={(e) =>
                    setNewItem({ ...newItem, nameKorean: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격
                </label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: parseInt(e.target.value) })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAdd}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                메뉴 추가
              </button>
            </div>
          </div>

          {/* 메뉴 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">메뉴 목록</h2>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  {editingItem?.id === item.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          메뉴명 (영문)
                        </label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          메뉴명 (한글)
                        </label>
                        <input
                          type="text"
                          value={editingItem.nameKorean}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              nameKorean: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          가격
                        </label>
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              price: parseInt(e.target.value)
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          카테고리
                        </label>
                        <input
                          type="text"
                          value={editingItem.category}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              category: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          설명
                        </label>
                        <textarea
                          value={editingItem.description}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingItem(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                        >
                          <X size={20} className="mr-2" />
                          취소
                        </button>
                        <button
                          onClick={() => handleSave(editingItem)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                        >
                          <Save size={20} className="mr-2" />
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">
                          {item.nameKorean} ({item.name})
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="mt-2">
                          <span className="text-red-600 font-medium">
                            {item.price.toLocaleString()}원
                          </span>
                          <span className="text-gray-500 ml-2">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-600 hover:text-gray-800"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
        </div>
      </main>
    </div>
  );
};

export default MenuManagementPage; 