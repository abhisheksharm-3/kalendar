"use client";
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import UpcomingEvent from './UpcomingEvent';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getAISummary } from '@/lib/ai-services';
import { Event } from '@/lib/types';

interface LeftSidebarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: Event[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ date, setDate, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentMonth(now.toLocaleString('default', { month: 'long' }));
    setCurrentDay(now.toLocaleString('default', { weekday: 'long' }));
  }, []);

  useEffect(() => {
    if (date && events.length > 0) {
      generateAISummary();
    }
  }, [date, events]);

  const getDayName = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString('default', { weekday: 'long' });
  };

  const getEventsForSelectedDay = () => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const generateAISummary = async () => {
    setIsLoading(true);
    const eventsForDay = getEventsForSelectedDay();
    try {
      const insights = await getAISummary(eventsForDay);
      setAiSummary(insights.join(' '));
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary("Unable to generate AI summary at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const eventsForSelectedDay = getEventsForSelectedDay();

  return (
    <div className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-y-scroll scrollbar-hide border-r">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold">{currentMonth} <span className='text-yellow-300'>{currentDate.getFullYear()}</span></h1>
        <p className="text-sm opacity-80">{currentDay}</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full text-lg font-semibold text-gray-700 dark:text-gray-300"
            onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          >
            Calendar
            {isCalendarExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isCalendarExpanded && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mt-2"
            />
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {getDayName(date)}, {date?.toLocaleDateString()}
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{aiSummary}</p>
          
          {eventsForSelectedDay.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Event List</h2>
              <div className="space-y-2">
                {eventsForSelectedDay.map((event) => (
                  <UpcomingEvent key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;