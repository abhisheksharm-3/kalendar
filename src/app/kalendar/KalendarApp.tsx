"use client"
import React, { useEffect, useState } from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import WeekView from '@/components/WeekView';
import DayView from '@/components/DayView';
import MonthView from '@/components/MonthView';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getGoogleCalendarEvents } from '@/lib/helpers/googleCalendar';
import { getGoogleAccessToken } from '@/lib/helpers/getGoogleAccessToken';

const KalendarApp = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccessToken() {
      const token = await getGoogleAccessToken();
      setAccessToken(token);
    }
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchEvents();
    }
  }, [date, view, accessToken]);

  const fetchEvents = async () => {
    if (!date || !accessToken) return;
    if (!date) return;

    let timeMin, timeMax;
    switch (view) {
      case 'day':
        timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        timeMax = new Date(date.setHours(23, 59, 59, 999)).toISOString();
        break;
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        timeMin = new Date(startOfWeek.setHours(0, 0, 0, 0)).toISOString();
        timeMax = new Date(endOfWeek.setHours(23, 59, 59, 999)).toISOString();
        break;
      case 'month':
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        timeMin = new Date(startOfMonth.setHours(0, 0, 0, 0)).toISOString();
        timeMax = new Date(endOfMonth.setHours(23, 59, 59, 999)).toISOString();
        break;
    }

    const fetchedEvents = await getGoogleCalendarEvents(accessToken, timeMin, timeMax);
    console.log(fetchedEvents);
    
    // setEvents(fetchedEvents);
  };

  const goToPrevious = () => {
    if(date){
      const newDate = new Date(date);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setDate(newDate);
  }
  };

  const goToNext = () => {
    if(date){
    const newDate = new Date(date);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setDate(newDate);
  }
  };

  const formatDateHeader = () => {
    switch (view) {
      case 'day':
        return date?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'week':
        if(date){
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString('default', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`;}
      case 'month':
        return date?.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen overflow-y-hidden bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <LeftSidebar date={date} setDate={setDate} />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">{formatDateHeader()}</h2>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === 'day' ? "default" : "outline"}
              onClick={() => setView('day')}
            >
              Day
            </Button>
            <Button 
              variant={view === 'week' ? "default" : "outline"}
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'month' ? "default" : "outline"}
              onClick={() => setView('month')}
            >
              Month
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-8" placeholder="Search" />
          </div>
        </div>
        {view === 'day' && <DayView currentDate={date} />}
        {view === 'week' && <WeekView currentDate={date} />}
        {view === 'month' && <MonthView currentDate={date} />}
      </div>
    </div>
  );
};

export default KalendarApp;