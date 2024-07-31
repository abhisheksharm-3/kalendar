import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
}

const DayView: React.FC<DayViewProps> = ({ currentDate, events }) => {
  const [date, setDate] = useState(currentDate);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const goToPreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const formatTime = (hour: number) => {
    return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getEventStyle = (event: Event) => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    const top = `${startDate.getHours() * 57 + startDate.getMinutes()}px`;
    const height = `${(endDate.getTime() - startDate.getTime()) / (40 * 1000)}px`;
    return { top, height };
  };

  const getDayEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={goToPreviousDay} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft />
          </button>
          <span className="font-semibold">
            {date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <button onClick={goToNextDay} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="flex">
          <div className="w-20 flex-shrink-0 border-r dark:border-gray-700">
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
            {getDayEvents().map((event, index) => {
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);
      return (
        <div
          key={event.id}
          className={`absolute left-0 right-0 bg-blue-500 text-white p-1 text-xs overflow-hidden rounded mx-1`}
          style={getEventStyle(event)}
        >
          <div className="font-bold">{event.summary}</div>
          <div>{formatTime(startDate.getHours())} - {formatTime(endDate.getHours())}</div>
        </div>
      );
    })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;