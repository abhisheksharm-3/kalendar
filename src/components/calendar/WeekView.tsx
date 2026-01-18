'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { EventType } from '@/lib/types';
import EventDetailsModal from './EventDetailModal';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);
const EVENT_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
];

interface WeekViewProps {
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

/**
 * Formats hour to 12-hour AM/PM format.
 */
function formatTime(hour: number, minute = 0): string {
  return `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

/**
 * Calculates the ISO week number for a given date.
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export default function WeekView({ currentDate, events, onEventUpdate }: WeekViewProps) {
  const [date, setDate] = useState(currentDate);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const weekDates = useMemo(() => {
    if (!date) return [];
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      return dayDate;
    });
  }, [date]);

  const handleDragStart = useCallback((e: React.DragEvent, event: EventType) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropDate: Date) => {
      e.preventDefault();
      setIsDragging(false);

      const draggedEvent: EventType = JSON.parse(e.dataTransfer.getData('text/plain'));
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const minutes = Math.floor(y / 2) * 30;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      const newStartDate = new Date(dropDate);
      newStartDate.setHours(hours, remainingMinutes);

      const oldStartDate = new Date(draggedEvent.start.dateTime);
      const oldEndDate = new Date(draggedEvent.end.dateTime);
      const duration = oldEndDate.getTime() - oldStartDate.getTime();
      const newEndDate = new Date(newStartDate.getTime() + duration);

      const updatedEvent: EventType = {
        ...draggedEvent,
        start: { ...draggedEvent.start, dateTime: newStartDate.toISOString() },
        end: { ...draggedEvent.end, dateTime: newEndDate.toISOString() },
      };

      onEventUpdate(updatedEvent);
    },
    [onEventUpdate]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleEventClick = useCallback((event: EventType) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }, []);

  const getEventStyle = useCallback((event: EventType) => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    const top = `${(startDate.getHours() * 60 + startDate.getMinutes()) * 2 + 4}px`;
    const height = `${(endDate.getTime() - startDate.getTime()) / (30 * 1000) - 8}px`;
    return { top, height };
  }, []);

  const formatDateHeader = (headerDate: Date) => {
    return `${WEEK_DAYS[headerDate.getDay()]} ${headerDate.getDate()}`;
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-center py-4 border-b border-border bg-gradient-subtle">
        <p className="text-lg font-medium text-muted-foreground">
          Week {date && getWeekNumber(date)}
        </p>
      </div>

      <div className="flex-grow overflow-auto scrollbar-thin" ref={containerRef}>
        <div className="grid grid-cols-8 h-full min-w-[800px]">
          <div className="col-span-1 border-r border-border bg-card/50">
            {TIME_SLOTS.map((hour) => (
              <div
                key={hour}
                className="h-[120px] text-right pr-3 text-xs font-medium text-muted-foreground flex items-start pt-1"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          <div className="col-span-7 overflow-x-auto scrollbar-thin">
            <div className="grid grid-cols-7 h-full">
              {weekDates.map((dayDate, index) => (
                <div key={index} className="border-r border-border last:border-r-0">
                  <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm px-2 py-3 text-center border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground">
                      {WEEK_DAYS[dayDate.getDay()]}
                    </span>
                    <div className="text-lg font-semibold">{dayDate.getDate()}</div>
                  </div>
                  <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayDate)}
                  >
                    {TIME_SLOTS.map((hour) => (
                      <div key={hour} className="h-[120px] border-b border-border/50 relative hover:bg-accent/20 transition-colors">
                        <div
                          className="absolute left-0 w-full h-px bg-border/30"
                          style={{ top: '50%' }}
                        />
                      </div>
                    ))}

                    {events
                      .filter((event) => {
                        const eventDate = new Date(event.start.dateTime);
                        return eventDate.toDateString() === dayDate.toDateString();
                      })
                      .map((event) => {
                        const startDate = new Date(event.start.dateTime);
                        const endDate = new Date(event.end.dateTime);

                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 ${getEventColor(event.id)} text-white p-2 text-xs overflow-hidden rounded-lg shadow-lg cursor-move hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}
                            style={getEventStyle(event)}
                            onClick={() => handleEventClick(event)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="font-semibold truncate">{event.summary}</div>
                            <div className="text-[10px] opacity-80 mt-0.5">
                              {formatTime(startDate.getHours(), startDate.getMinutes())} -{' '}
                              {formatTime(endDate.getHours(), endDate.getMinutes())}
                            </div>
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

      <EventDetailsModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
      />
    </div>
  );
}
