import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Menu, Plus} from "lucide-react";
import { RiCalendarLine } from '@remixicon/react';

interface CalendarHeaderProps {
  date: Date | undefined;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onDateChange: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpenSidebar: () => void;
  onOpenEventModal: () => void;
  onOpenAIScheduleModal: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  view,
  onViewChange,
  onDateChange,
  onPrevious,
  onNext,
  onToday,
  onOpenSidebar,
  onOpenEventModal,
  onOpenAIScheduleModal,
}) => {
  const formatDateHeader = () => {
    switch (view) {
      case 'day':
        return date?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'week':
        const endOfWeek = new Date(date || new Date());
        endOfWeek.setDate((date?.getDate() ?? 0) + 6);
        return `${date?.toLocaleDateString('default', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return date?.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-800 text-white">
        <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center">
          <Button variant="outline" onClick={onOpenAIScheduleModal}>
            Schedule with KAI
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenEventModal}>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center p-[22px] bg-gray-800 text-white">
        <div className="flex items-center">
          <RiCalendarLine className="text-purple-500 mr-2 text-2xl" />
          <p className="font-bold text-xl">Kalendar AI</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onToday}>Today</Button>
          <Button variant="outline" onClick={onOpenAIScheduleModal}>
            Schedule with KAI
          </Button>
          <Input className="w-64" placeholder="Search" />
          <Button variant="outline" onClick={onOpenEventModal}>New Event</Button>
        </div>
      </div>

      {/* Date and View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 p-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg lg:text-xl font-bold">{formatDateHeader()}</h2>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={view === 'day' ? "default" : "outline"}
            onClick={() => onViewChange('day')}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? "default" : "outline"}
            onClick={() => onViewChange('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? "default" : "outline"}
            onClick={() => onViewChange('month')}
          >
            Month
          </Button>
        </div>
      </div>
    </>
  );
};