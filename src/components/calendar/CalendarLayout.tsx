import React, { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import { useEvents } from '@/hooks/useEvents';
import { useCalendar } from '@/hooks/useCalendar';

interface CalendarLayoutProps {
  children: ReactNode;
}

const CalendarLayout: React.FC<CalendarLayoutProps> = ({ children }) => {
  const { events } = useEvents();
  const { date, setDate } = useCalendar();

  return (
    <div className='flex flex-row h-screen w-screen'>
      <div className="hidden lg:block"><LeftSidebar date={date} setDate={setDate} /></div>
      <div className="flex flex-col overflow-hidden bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 lg:w-5/6">
        {children}
      </div>
    </div>
  );
};

export default CalendarLayout;
