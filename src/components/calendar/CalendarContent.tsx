import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import type { EventType, CalendarViewType } from '@/lib/types';

interface CalendarContentProps {
  date: Date | undefined;
  view: CalendarViewType;
  events: EventType[];
  onEventUpdate: (event: EventType) => Promise<EventType>;
}

/**
 * Renders the appropriate calendar view based on the selected view type.
 */
export function CalendarContent({ date, view, events, onEventUpdate }: CalendarContentProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
      {view === 'day' && (
        <DayView currentDate={date} events={events} onEventUpdate={onEventUpdate} />
      )}
      {view === 'week' && (
        <WeekView currentDate={date} events={events} onEventUpdate={onEventUpdate} />
      )}
      {view === 'month' && <MonthView currentDate={date} events={events} />}
    </div>
  );
}