"use client"
import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";
import MobileCalendarModal from "@/components/MobileCalendarModal";
import InsightsPanel from "@/components/InsightsPanel";
import { cn } from "@/lib/utils";
import { Event } from '@/lib/types';
import { getAISchedule, getAIInsights } from '@/lib/ai-services';

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
  return response.json();
}

export default function KalendarApp() {
  const [events, setEvents] = useState<Event[]>([]);
  const [aiSchedule, setAISchedule] = useState<Event[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const initialEvents = await fetchFromApi<Event[]>('/api/user/calendar/googlecalendar/userevents');
        const userPreferences = await fetchFromApi<any>('/api/user/calendar/googlecalendar/userpreferences');
        const userHistory = await fetchFromApi<any>('/api/user/calendar/googlecalendar/userhistory');

        setEvents(initialEvents);

        const initialAISchedule = await getAISchedule(initialEvents, userPreferences);
        setAISchedule(initialAISchedule);

        const initialInsights = await getAIInsights(initialEvents, userHistory);
        setInsights(initialInsights);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Handle error (e.g., show error message to user)
      }
    }

    fetchInitialData();
  }, []);

  const updateAISchedule = async () => {
    try {
      const response = await fetch('/api/ai-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, userPreferences: {} /* Add user preferences here */ }),
      });
      if (response.ok) {
        const newAISchedule = await response.json();
        setAISchedule(newAISchedule);
      }
    } catch (error) {
      console.error("Error updating AI schedule:", error);
      // Handle error
    }
  };

  const updateInsights = async () => {
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, userHistory: {} /* Add user history here */ }),
      });
      if (response.ok) {
        const newInsights = await response.json();
        setInsights(newInsights);
      }
    } catch (error) {
      console.error("Error updating insights:", error);
      // Handle error
    }
  };

  const handleAISchedule = () => {
    updateAISchedule();
  };

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <AppSidebar open={open} setOpen={setOpen} date={date} setDate={setDate} />
      <Dashboard
        date={date}
        setDate={setDate}
        showMobileCalendar={showMobileCalendar}
        setShowMobileCalendar={setShowMobileCalendar}
        events={events}
        setEvents={setEvents}
        aiMode={aiMode}
        setAiMode={setAiMode}
        onAISchedule={handleAISchedule}
      />
      <InsightsPanel events={events} insights={insights} />
      <MobileCalendarModal
        show={showMobileCalendar}
        onClose={() => setShowMobileCalendar(false)}
        date={date}
        setDate={setDate}
      />
    </div>
  );
}