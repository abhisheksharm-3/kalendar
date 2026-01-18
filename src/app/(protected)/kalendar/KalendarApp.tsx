'use client';

import React, { useState, useCallback } from 'react';
import { useCalendar, useEvents } from '@/hooks';
import CalendarLayout from '@/components/calendar/CalendarLayout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContent } from '@/components/calendar/CalendarContent';
import { MobileSidebar } from '@/components/calendar/MobileSidebar';
import EventCreationModal from '@/components/calendar/CreateEvent';
import AIScheduleModal from '@/components/calendar/AIScheduleModal';
import LoadingState from '@/components/calendar/LoadingState';
import FailureComponent from '@/components/calendar/FailureState';
import type { UserPreferencesType } from '@/lib/types';

interface ScheduleRequestType {
  date: string;
  comments?: string;
}

const DEFAULT_USER_PREFERENCES: UserPreferencesType = {
  workStartTime: '09:00',
  workEndTime: '17:00',
  preferredMeetingDuration: 30,
  focusTimeBlocks: 2,
  lunchTime: '12:00',
  breakFrequency: 90,
};

export default function KalendarApp() {
  const { date, view, goToToday, goToPrevious, goToNext, setDate, setView } = useCalendar();
  const { events, isLoading, error, createEvent, updateEvent, refetchEvents } = useEvents();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAIScheduleModalOpen, setIsAIScheduleModalOpen] = useState(false);

  const handleRequestSchedule = useCallback(
    async (data: ScheduleRequestType) => {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          events,
          userPreferences: DEFAULT_USER_PREFERENCES,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI schedule');
      }

      return response.json();
    },
    [events]
  );

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleOpenEventModal = useCallback(() => setIsEventModalOpen(true), []);
  const handleOpenAIModal = useCallback(() => setIsAIScheduleModalOpen(true), []);

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
        onOpenSidebar={handleOpenSidebar}
        onOpenEventModal={handleOpenEventModal}
        onOpenAIScheduleModal={handleOpenAIModal}
      />
      <CalendarContent date={date} view={view} events={events} onEventUpdate={updateEvent} />
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
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
}