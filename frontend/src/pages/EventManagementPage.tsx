import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Plus, Edit2, Trash2, Save, X, Calendar } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'promotion' | 'notice' | 'event';
  status: 'active' | 'inactive';
}

const EventManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'event',
    status: 'active'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/events');
      if (!response.ok) throw new Error('이벤트를 불러오지 못했습니다.');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('이벤트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSave = async (event: Event) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) throw new Error('이벤트를 저장하지 못했습니다.');

      setEvents(events.map(e => (e.id === event.id ? event : e)));
      setEditingEvent(null);
      setSuccess('이벤트가 저장되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('이벤트를 저장하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/business/events/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('이벤트를 삭제하지 못했습니다.');

      setEvents(events.filter(event => event.id !== id));
      setSuccess('이벤트가 삭제되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('이벤트를 삭제하는 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) throw new Error('이벤트를 추가하지 못했습니다.');

      const addedEvent = await response.json();
      setEvents([...events, addedEvent]);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'event',
        status: 'active'
      });
      setSuccess('이벤트가 추가되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('이벤트를 추가하는 중 오류가 발생했습니다.');
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
          <h1 className="text-2xl font-bold mb-8">이벤트 관리</h1>

          {/* 새 이벤트 추가 폼 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">새 이벤트 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  유형
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      type: e.target.value as Event['type']
                    })
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="promotion">프로모션</option>
                  <option value="notice">공지사항</option>
                  <option value="event">이벤트</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endDate: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
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
                이벤트 추가
              </button>
            </div>
          </div>

          {/* 이벤트 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">이벤트 목록</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  {editingEvent?.id === event.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          제목
                        </label>
                        <input
                          type="text"
                          value={editingEvent.title}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              title: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          유형
                        </label>
                        <select
                          value={editingEvent.type}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              type: e.target.value as Event['type']
                            })
                          }
                          className="border rounded p-2 w-full"
                        >
                          <option value="promotion">프로모션</option>
                          <option value="notice">공지사항</option>
                          <option value="event">이벤트</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          시작일
                        </label>
                        <input
                          type="date"
                          value={editingEvent.startDate}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              startDate: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          종료일
                        </label>
                        <input
                          type="date"
                          value={editingEvent.endDate}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              endDate: e.target.value
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
                          value={editingEvent.description}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              description: e.target.value
                            })
                          }
                          className="border rounded p-2 w-full"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingEvent(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                        >
                          <X size={20} className="mr-2" />
                          취소
                        </button>
                        <button
                          onClick={() => handleSave(editingEvent)}
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
                        <h3 className="text-lg font-medium">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-1" />
                          <span>
                            {event.startDate} ~ {event.endDate}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{event.type}</span>
                          <span className="mx-2">•</span>
                          <span
                            className={`${
                              event.status === 'active'
                                ? 'text-green-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {event.status === 'active' ? '진행중' : '종료'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-gray-600 hover:text-gray-800"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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

export default EventManagementPage; 