"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const [date, setDate] = useState(currentDate);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToPreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - (isMobile ? 3 : 7));
    setDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (isMobile ? 3 : 7));
    setDate(newDate);
  };

  const getDates = () => {
    const dates = [];
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - (isMobile ? 1 : date.getDay()));
    
    for (let i = 0; i < (isMobile ? 3 : 7); i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
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

  const getEventColor = (event: Event) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <button onClick={goToPreviousDay} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {`${getDates()[0].toLocaleDateString()} - ${getDates()[getDates().length - 1].toLocaleDateString()}`}
        </h2>
        <button onClick={goToNextDay} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-auto scrollbar-hide" ref={containerRef}>
        <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-8'} h-full`}>
          <div className="col-span-1 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] text-right pr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className={`${isMobile ? 'col-span-3' : 'col-span-7'} overflow-hidden`}>
            <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-7'} h-full`}>
              {getDates().map((date, index) => (
                <div key={index} className="border-r dark:border-gray-700">
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 text-center border-b dark:border-gray-700 font-semibold">
                    {formatDateHeader(date)}
                  </div>
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div key={hour} className="h-[60px] border-b dark:border-gray-700 relative">
                        <div className="absolute left-0 w-full h-px bg-gray-200 dark:bg-gray-700" style={{ top: '50%' }}></div>
                      </div>
                    ))}
                    {events
                      .filter(event => {
                        const eventDate = new Date(event.start.dateTime);
                        return eventDate.toDateString() === date.toDateString();
                      })
                      .map((event, eventIndex) => {
                        const eventColor = getEventColor(event);
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                            className={`absolute left-1 right-1 ${eventColor} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md`}
                            style={getEventStyle(event)}
                          >
                            <div className="font-bold truncate">{event.summary}</div>
                            <div className="text-xs opacity-80">
                              {formatTime(new Date(event.start.dateTime).getHours())} - {formatTime(new Date(event.end.dateTime).getHours())}
                            </div>
                          </motion.div>
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