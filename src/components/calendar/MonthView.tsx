'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { EventType } from '@/lib/types';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import DayEventsModal from './DayEventsModal';

const EVENT_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MonthViewProps {
  currentDate: Date | undefined;
  events: EventType[];
}

/**
 * Generates a deterministic color based on event ID.
 */
function getEventColor(eventId: string): string {
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length];
}

export default function MonthView({ currentDate, events }: MonthViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    if (!currentDate) return [];
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDay = useCallback(
    (day: Date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.start.dateTime);
        return isSameDay(eventDate, day);
      });
    },
    [events]
  );

  const handleDayClick = useCallback((day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  }, []);

  if (!currentDate) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h2 className="text-2xl font-bold text-center">{format(currentDate, 'MMMM yyyy')}</h2>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center font-semibold py-2 bg-gray-100 dark:bg-gray-800 text-sm md:text-base"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={index}
              className={`min-h-[80px] md:min-h-[120px] bg-white dark:bg-gray-800 p-1 ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''
                } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              onClick={() => handleDayClick(day)}
            >
              <div
                className={`text-right ${isSameDay(day, new Date())
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto'
                    : ''
                  }`}
              >
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1 overflow-y-auto scrollbar-hide max-h-[50px] md:max-h-[80px]">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${getEventColor(event.id)}`}
                    title={event.summary}
                  >
                    {event.summary}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DayEventsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDate}
        events={events}
      />
    </div>
  );
}