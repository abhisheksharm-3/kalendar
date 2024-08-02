"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';

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
    const top = `${startDate.getHours() * 60 + startDate.getMinutes()}px`;
    const height = `${(endDate.getTime() - startDate.getTime()) / (60 * 1000)}px`;
    return { top, height };
  };

  const getDayEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
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
      <div className="flex-grow overflow-auto scrollbar-hide scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="flex">
          <div className="w-20 flex-shrink-0 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] text-right pr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="flex-grow relative">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] border-b dark:border-gray-700 relative">
                <div className="absolute left-0 w-full h-px bg-gray-200 dark:bg-gray-700" style={{ top: '50%' }}></div>
              </div>
            ))}
            {getDayEvents().map((event, index) => {
              const startDate = new Date(event.start.dateTime);
              const endDate = new Date(event.end.dateTime);
              const eventColor = getEventColor(event);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`absolute left-1 right-1 ${eventColor} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md`}
                  style={getEventStyle(event)}
                >
                  <div className="font-bold truncate">{event.summary}</div>
                  <div className="text-xs opacity-80">{formatTime(startDate.getHours())} - {formatTime(endDate.getHours())}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;