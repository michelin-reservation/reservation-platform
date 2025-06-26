import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  reserved: boolean;
  guests?: number;
}

interface TimeLineProps {
  timeSlots: TimeSlot[];
  onTimeSlotClick?: (time: string) => void;
}

const TimeLine: React.FC<TimeLineProps> = ({ timeSlots, onTimeSlotClick }) => {
  return (
    <div className="space-y-3">
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            slot.reserved
              ? 'bg-red-50 border border-red-200'
              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => onTimeSlotClick?.(slot.time)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span className="font-medium">{slot.time}</span>
            </div>
            {slot.reserved ? (
              <span className="text-red-600">
                예약됨 ({slot.guests}명)
              </span>
            ) : (
              <span className="text-gray-500">가능</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeLine; 