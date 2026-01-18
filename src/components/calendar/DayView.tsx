'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { EventType } from '@/lib/types';
import EventDetailsModal from './EventDetailModal';

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);
const EVENT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
];

interface DayViewProps {
  currentDate: Date | undefined;
  events: EventType[];
  onEventUpdate: (updatedEvent: EventType) => void;
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

function formatTime(hour: number): string {
  return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function DayView({ currentDate, events, onEventUpdate }: DayViewProps) {
  const [date, setDate] = useState(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const getEventStyle = useCallback((event: EventType) => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    const top = `${(startDate.getHours() * 60 + startDate.getMinutes()) * 2 + 4}px`;
    const height = `${(endDate.getTime() - startDate.getTime()) / (30 * 1000) - 8}px`;
    return { top, height };
  }, []);

  const dayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date?.toDateString();
    });
  }, [events, date]);

  const handleEventClick = useCallback((event: EventType) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, event: EventType) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const draggedEvent: EventType = JSON.parse(e.dataTransfer.getData('text/plain'));

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const minutes = Math.floor(y / 2) * 30;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      const newStartDate = new Date(date || new Date());
      newStartDate.setHours(hours, remainingMinutes);

      const duration =
        new Date(draggedEvent.end.dateTime).getTime() -
        new Date(draggedEvent.start.dateTime).getTime();
      const newEndDate = new Date(newStartDate.getTime() + duration);

      const updatedEvent: EventType = {
        ...draggedEvent,
        start: { ...draggedEvent.start, dateTime: newStartDate.toISOString() },
        end: { ...draggedEvent.end, dateTime: newEndDate.toISOString() },
      };

      onEventUpdate(updatedEvent);
    },
    [date, onEventUpdate]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      <div className="flex-grow overflow-auto scrollbar-hide">
        <div className="flex">
          <div className="w-24 flex-shrink-0 border-r dark:border-gray-700">
            {TIME_SLOTS.map((hour) => (
              <div
                key={hour}
                className="h-[120px] text-right pr-2 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="flex-grow relative" onDragOver={handleDragOver} onDrop={handleDrop}>
            {TIME_SLOTS.map((hour) => (
              <div key={hour} className="h-[120px] border-b dark:border-gray-700 relative">
                <div
                  className="absolute left-0 w-full h-px bg-gray-200 dark:bg-gray-700"
                  style={{ top: '50%' }}
                />
              </div>
            ))}
            {dayEvents.map((event) => {
              const startDate = new Date(event.start.dateTime);
              const endDate = new Date(event.end.dateTime);

              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 hover:brightness-90 duration-300 cursor-move ${getEventColor(event.id)} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md ${isDragging ? 'opacity-50' : ''}`}
                  style={getEventStyle(event)}
                  onClick={() => handleEventClick(event)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="font-bold truncate">{event.summary}</div>
                  <div className="text-xs opacity-80">
                    {formatTime(startDate.getHours())} - {formatTime(endDate.getHours())}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
      />
    </div>
  );
}
