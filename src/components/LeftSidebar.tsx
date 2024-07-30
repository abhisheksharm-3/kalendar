"use client";
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import UpcomingEvent from './UpcomingEvent';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  time: string;
  description?: string;
  link?: string;
}

interface LeftSidebarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ date, setDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentMonth(now.toLocaleString('default', { month: 'long' }));
    setCurrentDay(now.toLocaleString('default', { weekday: 'long' }));
  }, []);

  const getDayName = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString('default', { weekday: 'long' });
  };

  const upcomingEvents: Event[] = [
    { id: 1, title: "All Hands Company Meeting", time: "8:30 - 9:00 AM", description: "Monthly catch-up" },
    { id: 2, title: "Quarterly review", time: "9:30 - 10:00 AM", link: "https://zoom.us/j/1234567890" },
    { id: 3, title: "Visit to discuss improvements", time: "8:30 - 9:00 AM", link: "https://zoom.us/j/0987654321" },
    { id: 4, title: "Presentation on new products and cost structure", time: "8:30 - 9:00 AM" },
    { id: 5, title: "City Sales Pitch", time: "8:30 - 9:00 AM", link: "https://zoom.us/j/1357924680" },
  ];

  const getEventsForSelectedDay = () => {
    if (!date) return [];
    return upcomingEvents.filter(event => {
      const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date.getDate());
      return eventDate.getDate() === date.getDate();
    });
  };

  const generateDaySummary = (events: Event[]) => {
    if (events.length === 0) return `You have no events scheduled for ${getDayName(date)}, ${date?.toLocaleDateString()}.`;
    let summary = `You have ${events.length} event(s) scheduled for ${getDayName(date)}, ${date?.toLocaleDateString()}. `;
    let busyCount = 0;
    events.forEach(event => {
      if (event.time.includes("AM")) {
        summary += `In the morning, you have "${event.title}". `;
      } else {
        summary += `In the afternoon, you have "${event.title}". `;
      }
      busyCount++;
    });
    summary += `Overall, the day is ${busyCount > 3 ? "busy and not very productive." : "quite productive."}`;
    return summary;
  };

  const eventsForSelectedDay = getEventsForSelectedDay();
  const daySummary = generateDaySummary(eventsForSelectedDay);

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
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{daySummary}</p>
          
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