"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import UpcomingEvent from './UpcomingEvent';
import { ChevronDown, ChevronUp, X, Calendar as CalendarIcon, Loader2, Zap, Sun } from 'lucide-react';
import { Event } from '@/lib/types';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LeftSidebarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: Event[];
  onClose?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ date, setDate, events, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastProcessedEvents, setLastProcessedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentMonth(now.toLocaleString('default', { month: 'long' }));
    setCurrentDay(now.toLocaleString('default', { weekday: 'long' }));
  }, []);

  const getDayName = useCallback((date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString('default', { weekday: 'long' });
  }, []);

  const getEventsForSelectedDay = useCallback(() => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [date, events]);

  const eventsForSelectedDay = useMemo(() => getEventsForSelectedDay(), [getEventsForSelectedDay]);

  const generateAISummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsForSelectedDay }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch AI summary');
      }
  
      const insights = await response.json();
      setAiSummary(insights.join(' '));
      setLastProcessedEvents(eventsForSelectedDay);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary("Unable to generate AI summary at this time.");
    } finally {
      setIsLoading(false);
    }
  }, [eventsForSelectedDay]);

  useEffect(() => {
    if (date && eventsForSelectedDay.length > 0 && 
        (eventsForSelectedDay.length !== lastProcessedEvents.length || 
         eventsForSelectedDay.some((event, index) => event.id !== lastProcessedEvents[index]?.id))) {
      generateAISummary();
    } else if (eventsForSelectedDay.length === 0) {
      setAiSummary('');
      setLastProcessedEvents([]);
    }
  }, [date, eventsForSelectedDay, lastProcessedEvents, generateAISummary]);

  const NoEventsMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-inner"
    >
      <Sun className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Clear Schedule Ahead!</h3>
      <p className="text-gray-600 dark:text-gray-400">Enjoy your free time today. Maybe it&apos;s a good day for that hobby you&apos;ve been neglecting?</p>
    </motion.div>
  );

  const NoSummaryMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-inner"
    >
      <Zap className="mx-auto h-16 w-16 text-purple-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Insights Coming Soon!</h3>
      <p className="text-gray-600 dark:text-gray-400">We&apos;re preparing to analyze your day. Check back in a moment for AI-powered insights!</p>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-full md:w-80 h-full bg-white dark:bg-gray-900 shadow-lg lg:rounded-lg overflow-y-auto scrollbar-hide border-r"
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{currentMonth} <span className='text-yellow-300'>{currentDate.getFullYear()}</span></h1>
          <p className="text-sm opacity-80">{currentDay}</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="p-4">
        <motion.div 
          className="mb-4"
          initial={false}
          animate={{ height: isCalendarExpanded ? "auto" : 40 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="flex items-center justify-between w-full text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
            onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2" size={20} />
              Calendar
            </div>
            {isCalendarExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence>
            {isCalendarExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mt-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {getDayName(date)}, {date?.toLocaleDateString()}
          </h2>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center p-4"
              >
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Generating AI summary...</span>
              </motion.div>
            ) : eventsForSelectedDay.length === 0 ? (
              <NoEventsMessage />
            ) : !aiSummary ? (
              <NoSummaryMessage />
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">KAI Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{aiSummary}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {eventsForSelectedDay.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Event List</h2>
              <div className="space-y-3">
                {eventsForSelectedDay.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <UpcomingEvent event={event} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;