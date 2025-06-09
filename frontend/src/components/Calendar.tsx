import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  reservedDates?: string[]; // YYYY-MM-DD 형식의 예약된 날짜 배열
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  className = '',
  reservedDates = []
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(value);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isReserved = (date: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return reservedDates.includes(dateStr);
  };

  const isSelected = (date: number) => {
    return (
      date === value.getDate() &&
      currentMonth.getMonth() === value.getMonth() &&
      currentMonth.getFullYear() === value.getFullYear()
    );
  };

  const handleDateClick = (date: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    onChange(newDate);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="bg-white p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-white p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = index + 1;
          const reserved = isReserved(date);
          const selected = isSelected(date);
          return (
            <button
              key={date}
              onClick={() => handleDateClick(date)}
              disabled={reserved}
              className={`p-2 text-center ${
                reserved
                  ? 'bg-red-50 text-red-600 cursor-not-allowed'
                  : selected
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 