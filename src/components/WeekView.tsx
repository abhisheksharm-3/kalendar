"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const [date, setDate] = useState(currentDate);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const goToPreviousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    setDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    setDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      dates.push(dayDate);
    }
    return dates;
  };

  const formatDateHeader = (date: Date) => {
    return `${weekDays[date.getDay()]} ${date.getDate()}`;
  };

  const formatTime = (hour: number) => {
    return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getEventStyle = (event: Event) => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    const top = `${startDate.getHours() * 60 + startDate.getMinutes()}px`;
    const height = `${(endDate.getTime() - startDate.getTime()) / (60 * 1000)}px`;
    return { top, height };
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft />
          </button>
          <span className="font-semibold">
            {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-scroll scrollbar-hide">
        <div className="grid grid-cols-8 h-full">
          <div className="col-span-1 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] text-right pr-2 text-sm">
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="col-span-7 overflow-hide" ref={containerRef}>
            <div className="grid grid-cols-7 h-full">
              {getWeekDates().map((date, index) => (
                <div key={index} className="border-r dark:border-gray-700">
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 text-center border-b dark:border-gray-700">
                    {formatDateHeader(date)}
                  </div>
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div key={hour} className="h-[60px] border-b dark:border-gray-700"></div>
                    ))}
                    {events
      .filter(event => {
        const eventDate = new Date(event.start.dateTime);
        return eventDate >= getWeekDates()[0] && eventDate <= getWeekDates()[6];
      })
      .map(event => {
        const eventDate = new Date(event.start.dateTime);
        const dayIndex = eventDate.getDay();
        return (
          <div
            key={event.id}
            className={`absolute left-0 right-0 bg-blue-500 text-white p-1 text-xs overflow-hidden rounded`}
            style={{
              ...getEventStyle(event),
              left: `${(100 / 7) * dayIndex}%`,
              width: `${150 / 7}%`,
            }}
          >
            {event.summary}
          </div>
        );
      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;