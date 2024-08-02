import React from 'react';
import { Event } from '@/lib/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

interface MonthViewProps {
  currentDate: Date | undefined;
  events: Event[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events }) => {
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
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <h2 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2 bg-gray-100 dark:bg-gray-800">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`min-h-[100px] bg-white dark:bg-gray-800 p-1 ${
              !isSameMonth(day, currentDate) ? 'opacity-50' : ''
            }`}
          >
            <div className={`text-right ${
              day.toDateString() === new Date().toDateString() 
                ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto'
                : ''
            }`}>
              {format(day, 'd')}
            </div>
            <div className="mt-1 space-y-1 overflow-y-auto scrollbar-hide max-h-[80px]">
              {getEventsForDay(day).slice(0, 3).map(event => (
                <div 
                  key={event.id} 
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded truncate"
                  title={event.summary}
                >
                  {event.summary}
                </div>
              ))}
              {getEventsForDay(day).length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{getEventsForDay(day).length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;