"use client"
import React, { useState } from 'react';
import { Event } from '@/lib/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import DayEventsModal from './DayEventsModal';

interface MonthViewProps {
  currentDate: Date | undefined;
  events: Event[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  if (!currentDate) return null;

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentDate);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return isSameDay(eventDate, day);
    });
  };
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const getEventColor = (event: Event) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h2 className="text-2xl font-bold text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2 bg-gray-100 dark:bg-gray-800 text-sm md:text-base">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div 
          key={index} 
          className={`min-h-[80px] md:min-h-[120px] bg-white dark:bg-gray-800 p-1 ${
            !isSameMonth(day, currentDate) ? 'opacity-50' : ''
          } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          onClick={() => handleDayClick(day)}
        >
            <div className={`text-right ${
              isSameDay(day, new Date()) 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto'
                : ''
            }`}>
              {format(day, 'd')}
            </div>
            <div className="mt-1 space-y-1 overflow-y-auto scrollbar-hide max-h-[50px] md:max-h-[80px]">
              {getEventsForDay(day).slice(0, 2).map(event => (
                <div 
                  key={event.id} 
                  className={`text-xs p-1 rounded truncate ${getEventColor(event)}`}
                  title={event.summary}
                >
                  {event.summary}
                </div>
              ))}
              {getEventsForDay(day).length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  +{getEventsForDay(day).length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <DayEventsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDate}
        events={events}
      />
    </div>
  );
};

export default MonthView;