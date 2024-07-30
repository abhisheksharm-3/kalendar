import React from 'react';
import { Event } from '@/lib/types';

interface MonthViewProps {
  currentDate: Date | undefined;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const events: Event[] = []; // Replace with actual events for the month

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  if(!currentDate) return null;
  const days = getDaysInMonth(currentDate);

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-semibold">{day}</div>
      ))}
      {days.map((day, index) => (
        <div key={index} className="h-24 border dark:border-gray-700 p-1">
          {day && (
            <>
              <div className="text-right">{day.getDate()}</div>
              <div className="text-xs">
                {events
                  .filter(event => event.day === day.getDate())
                  .slice(0, 3)
                  .map(event => (
                    <div key={event.id} className={`${event.color} p-1 mb-1 rounded truncate`}>
                      {event.title}
                    </div>
                  ))}
                {events.filter(event => event.day === day.getDate()).length > 3 && (
                  <div className="text-gray-500">More...</div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MonthView;