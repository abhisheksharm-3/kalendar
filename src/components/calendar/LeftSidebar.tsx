'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import UpcomingEvent from './UpcomingEvent';
import {
  ChevronDown,
  ChevronUp,
  X,
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
  Sun,
  RefreshCw,
} from 'lucide-react';
import type { EventType } from '@/lib/types';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LeftSidebarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: EventType[];
  onClose?: () => void;
}

function NoEventsMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6 rounded-xl bg-secondary/50 border border-border"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500 flex items-center justify-center">
        <Sun className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-base font-semibold mb-1">Clear Schedule!</h3>
      <p className="text-sm text-muted-foreground">
        No events planned. Perfect time for something new.
      </p>
    </motion.div>
  );
}

function NoSummaryMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6 rounded-xl bg-secondary/50 border border-border"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-base font-semibold mb-1">AI Insights Loading</h3>
      <p className="text-sm text-muted-foreground">
        Analyzing your schedule...
      </p>
    </motion.div>
  );
}

export default function LeftSidebar({ date, setDate, events, onClose }: LeftSidebarProps) {
  const [currentDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentDay = currentDate.toLocaleString('default', { weekday: 'long' });

  const eventsForSelectedDay = useMemo(() => {
    if (!date) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [date, events]);

  const generateAISummary = useCallback(async () => {
    if (eventsForSelectedDay.length === 0) {
      setAiSummary('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsForSelectedDay }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI summary');
      }

      const insights = await response.json();
      setAiSummary(insights.join(' '));
    } catch {
      setAiSummary('Unable to generate AI summary.');
    } finally {
      setIsLoading(false);
    }
  }, [eventsForSelectedDay]);

  useEffect(() => {
    if (date && events.length > 0) {
      const timeoutId = setTimeout(generateAISummary, 500);
      return () => clearTimeout(timeoutId);
    }
    setAiSummary('');
  }, [date, events, generateAISummary]);

  const getDayName = (selectedDate: Date | undefined) => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleString('default', { weekday: 'long' });
  };

  const handleToggleCalendar = useCallback(() => {
    setIsCalendarExpanded((prev) => !prev);
  }, []);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="w-full md:w-80 h-full bg-card border-r border-border overflow-y-auto scrollbar-thin"
    >
      {/* Header */}
      <div className="p-5 bg-primary text-primary-foreground">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-heading tracking-tight">
              {currentMonth}{' '}
              <span className="opacity-80">{currentDate.getFullYear()}</span>
            </h1>
            <p className="text-sm opacity-70 mt-1">{currentDay}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden text-primary-foreground hover:bg-white/20 -mt-1 -mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Calendar Section */}
        <motion.div
          className="rounded-xl border border-border bg-card overflow-hidden"
          initial={false}
          animate={{ height: isCalendarExpanded ? 'auto' : 48 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-secondary/50 transition-colors"
            onClick={handleToggleCalendar}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>Calendar</span>
            </div>
            {isCalendarExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <AnimatePresence>
            {isCalendarExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-2 pb-3"
              >
                <Calendar mode="single" selected={date} onSelect={setDate} className="w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Selected Day Info */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {getDayName(date)}
            <span className="text-muted-foreground text-sm font-normal ml-2">
              {date?.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
            </span>
          </h2>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center p-6"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Generating insights...</span>
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
                className="p-4 rounded-xl bg-secondary/50 border border-border"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold">KAI Insights</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={generateAISummary}
                    className="h-8 w-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event List */}
          {eventsForSelectedDay.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Events ({eventsForSelectedDay.length})
              </h3>
              <div className="space-y-2">
                {eventsForSelectedDay.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
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
}
