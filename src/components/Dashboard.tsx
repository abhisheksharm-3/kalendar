import React from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarMain from "./CalendarMain";
import { Event } from '@/types';

interface DashboardProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  showMobileCalendar: boolean;
  setShowMobileCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  aiMode: boolean;
  setAiMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAISchedule: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  date,
  setDate,
  showMobileCalendar,
  setShowMobileCalendar,
  events,
  setEvents,
  aiMode,
  setAiMode,
  onAISchedule
}) => (
  <div className="flex flex-1 flex-col">
    <CalendarHeader
      date={date}
      setShowMobileCalendar={setShowMobileCalendar}
      aiMode={aiMode}
      setAiMode={setAiMode}
      onAISchedule={onAISchedule}
    />
    <div className="flex flex-1">
      <CalendarMain
        date={date}
        events={events}
        setEvents={setEvents}
        aiMode={aiMode}
      />
    </div>
  </div>
);

export default Dashboard;