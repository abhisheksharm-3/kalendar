import React from 'react';
import { Event } from '@/lib/types';

interface DayViewProps {
  currentDate: Date | undefined;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const events: Event[] = []; // Replace with actual events for the day

  const formatTime = (hour: number) => {
    return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getEventStyle = (event: Event) => {
    const top = `${(event.start - timeSlots[0]) * 60}px`;
    const height = `${event.duration * 60}px`;
    return { top, height };
  };

  return (
    <div className="grid grid-cols-1 h-full">
      <div className="overflow-auto">
        <div className="flex">
          <div className="w-20 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] text-right pr-2 text-sm">
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="flex-grow relative">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] border-b dark:border-gray-700"></div>
            ))}
            {events.map(event => (
              <div
                key={event.id}
                className={`absolute left-0 right-0 ${event.color} p-1 text-xs overflow-hidden rounded`}
                style={getEventStyle(event)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;