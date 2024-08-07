import React from 'react';
import { Event } from '@/lib/types';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';

interface CalendarContentProps {
  date: Date | undefined;
  view: 'day' | 'week' | 'month';
  events: Event[];
  onEventUpdate: (event: Event) => Promise<Event>;
}

export const CalendarContent: React.FC<CalendarContentProps> = ({ date, view, events, onEventUpdate }) => (
  <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
    {view === 'day' && <DayView currentDate={date} events={events} onEventUpdate={onEventUpdate} />}
    {view === 'week' && <WeekView currentDate={date} events={events} onEventUpdate={onEventUpdate} />}
    {view === 'month' && <MonthView currentDate={date} events={events} />}
  </div>
);