"use client";
import React, { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarLayout from '@/components/calendar/CalendarLayout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContent } from '@/components/calendar/CalendarContent';
import { MobileSidebar } from '@/components/calendar/MobileSidebar';
import EventCreationModal from '@/components/calendar/CreateEvent';
import AIScheduleModal from '@/components/calendar/AIScheduleModal';
import { useEvents } from '@/hooks/useEvents';
import LoadingState from '@/components/calendar/LoadingState';
import FailureComponent from '@/components/calendar/FailiureComponent';

const KalendarApp: React.FC = () => {
  const { date, view, goToToday, goToPrevious, goToNext, setDate, setView } = useCalendar();
  const { events, isLoading, error, createEvent, updateEvent, refetchEvents } = useEvents();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAIScheduleModalOpen, setIsAIScheduleModalOpen] = useState(false);

  const handleRequestSchedule = async (data: { date: string, comments?: string }) => {
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          events,
          userPreferences: {} // You might want to fetch user preferences from somewhere
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI schedule:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <FailureComponent onRetry={refetchEvents} />;
  }

  return (
    <CalendarLayout>
      <CalendarHeader
        date={date}
        view={view}
        onViewChange={setView}
        onDateChange={setDate}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenEventModal={() => setIsEventModalOpen(true)}
        onOpenAIScheduleModal={() => setIsAIScheduleModalOpen(true)}
      />
      <CalendarContent
        date={date}
        view={view}
        events={events}
        onEventUpdate={updateEvent}
      />
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        date={date}
        setDate={setDate}
        events={events}
      />
      <EventCreationModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        onCreateEvent={createEvent}
      />
      <AIScheduleModal
        isOpen={isAIScheduleModalOpen}
        onOpenChange={setIsAIScheduleModalOpen}
        onRequestSchedule={handleRequestSchedule}
      />
    </CalendarLayout>
  );
};

export default KalendarApp;