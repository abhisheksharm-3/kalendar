import type { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import { useEvents, useCalendar } from '@/hooks';

interface CalendarLayoutProps {
  children: ReactNode;
}

/**
 * Layout component that provides the calendar sidebar and main content area.
 */
export default function CalendarLayout({ children }: CalendarLayoutProps) {
  const { events } = useEvents();
  const { date, setDate } = useCalendar();

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="hidden lg:block">
        <LeftSidebar date={date} setDate={setDate} events={events} />
      </div>
      <div className="flex flex-col overflow-hidden bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 w-screen lg:w-5/6">
        {children}
      </div>
    </div>
  );
}
