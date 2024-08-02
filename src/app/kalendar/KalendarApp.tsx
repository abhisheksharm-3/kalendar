"use client";
import React, { useState, useEffect } from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import WeekView from '@/components/WeekView';
import DayView from '@/components/DayView';
import MonthView from '@/components/MonthView';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Menu, Search, X } from "lucide-react";
import { Event } from '@/lib/types';
import { RiCalendarLine } from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';

interface KalendarAppProps {
  events: Event[];
}

const KalendarApp: React.FC<KalendarAppProps> = ({ events }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (date) {
      filterEventsByDate();
    }
  }, [date, view, events]);

  const filterEventsByDate = () => {
    if (!date) return;

    let timeMin: string, timeMax: string;
    switch (view) {
      case 'day':
        timeMin = new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString();
        timeMax = new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString();
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

    const filtered = events.filter(event => {
      const eventStart = new Date(event.start.dateTime).toISOString();
      return eventStart >= timeMin && eventStart <= timeMax;
    });

    setFilteredEvents(filtered);
  };

  const goToPrevious = () => {
    if (!date) return;
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
  };

  const goToNext = () => {
    if (!date) return;
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
  };

  const formatDateHeader = () => {
    if (!date) return '';
    switch (view) {
      case 'day':
        return date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'week':
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString('default', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <LeftSidebar
          date={date}
          setDate={setDate}
          events={events}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 bg-gray-800 text-white">
          <div className="flex items-center">
            <RiCalendarLine className="text-purple-500 mr-2 text-2xl" />
            <p className="font-bold text-xl">Kalendar AI</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center p-[22px] bg-gray-800 text-white">
          <h1 className="text-2xl font-bold">Kalendar AI</h1>
          <div className="flex items-center space-x-4">
            <Input className="w-64" placeholder="Search" />
            <Button variant="outline">New Event</Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold">{formatDateHeader()}</h2>
                <Button variant="outline" size="icon" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
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
            </div>
            <div className="relative w-full md:hidden">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-8 w-full" placeholder="Search" />
            </div>
          </div>
          {view === 'day' && date && <DayView currentDate={date} events={filteredEvents} />}
          {view === 'week' && date && <WeekView currentDate={date} events={filteredEvents} />}
          {view === 'month' && date && <MonthView currentDate={date} events={events}/>}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
            <motion.div
              className="relative w-80 h-full bg-white dark:bg-gray-800 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <LeftSidebar
                date={date}
                setDate={setDate}
                events={events}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KalendarApp;