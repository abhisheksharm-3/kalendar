"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';

interface WeekViewProps {
  currentDate?: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate = new Date() }) => {
  const [date, setDate] = useState(new Date(currentDate));
  const [events, setEvents] = useState<Event[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

  useEffect(() => {
    // Fetch events for the current week
    fetchEvents(date);
  }, [date]);

  const fetchEvents = (date: Date) => {
    // This is where you would typically fetch events from an API
    // For now, we'll use the static events data
    const staticEvents: Event[] = [
      { id: 1, title: "Monday Wake Up", day: 1, start: 8, duration: 0.5, color: "bg-blue-700" },
      { id: 2, title: "All-Team Kickoff", day: 1, start: 9, duration: 1, color: "bg-blue-700" },
      { id: 3, title: "Financial Update", day: 1, start: 10, duration: 1, color: "bg-blue-700" },
      { id: 4, title: "New Employee Welcome Lunch!", day: 1, start: 11, duration: 1, color: "bg-purple-700" },
      { id: 5, title: "Design Review", day: 1, start: 13, duration: 2, color: "bg-blue-700" },
      { id: 6, title: "1:1 with Jon", day: 1, start: 14, duration: 1, color: "bg-orange-700" },
      { id: 7, title: "Design Review", day: 2, start: 9, duration: 1, color: "bg-blue-700" },
      { id: 8, title: "Figma - Acme Meetin...", day: 2, start: 9, duration: 1, color: "bg-green-700" },
      { id: 9, title: "Concept Design Review II", day: 2, start: 14, duration: 1, color: "bg-blue-700" },
      { id: 10, title: "Design System Kickoff Lunch", day: 2, start: 12, duration: 1, color: "bg-blue-700" },
      { id: 11, title: "Coffee Chat", day: 3, start: 9, duration: 1, color: "bg-blue-700" },
      { id: 12, title: "Onboarding Presentation", day: 3, start: 11, duration: 1, color: "bg-purple-700" },
      { id: 13, title: "MVP Prioritization Workshop", day: 3, start: 13, duration: 2, color: "bg-blue-700" },
      { id: 14, title: "Design Team Happy Hour", day: 3, start: 16, duration: 1, color: "bg-red-700" },
      { id: 15, title: "Coffee Chat", day: 5, start: 9, duration: 1, color: "bg-blue-700" },
      { id: 16, title: "Health Benefits Walkthrough", day: 5, start: 10, duration: 1, color: "bg-purple-700" },
      { id: 17, title: "Design Review", day: 5, start: 13, duration: 2, color: "bg-blue-700" },
      { id: 18, title: "Marketing Meet-and-Greet", day: 5, start: 12, duration: 1, color: "bg-blue-700" },
      { id: 19, title: "1:1 with Heather", day: 5, start: 14, duration: 1, color: "bg-orange-700" },
      { id: 20, title: "Happy Hour", day: 5, start: 16, duration: 1, color: "bg-red-700" },
    ];
    setEvents(staticEvents);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    setDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    setDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      dates.push(dayDate);
    }
    return dates;
  };

  const formatDateHeader = (date: Date) => {
    return `${weekDays[date.getDay()]} ${date.getDate()}`;
  };

  const formatTime = (hour: number) => {
    return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getEventStyle = (event: Event) => {
    const top = `${(event.start - timeSlots[0]) * 60}px`;
    const height = `${event.duration * 60}px`;
    return { top, height };
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft />
          </button>
          <span className="font-semibold">
            {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-scroll scrollbar-hide">
        <div className="grid grid-cols-8 h-full">
          <div className="col-span-1 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[60px] text-right pr-2 text-sm">
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="col-span-7 overflow-hide" ref={containerRef}>
            <div className="grid grid-cols-7 h-full">
              {getWeekDates().map((date, index) => (
                <div key={index} className="border-r dark:border-gray-700">
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 text-center border-b dark:border-gray-700">
                    {formatDateHeader(date)}
                  </div>
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div key={hour} className="h-[60px] border-b dark:border-gray-700"></div>
                    ))}
                    {events
                      .filter(event => event.day === index)
                      .map(event => (
                        <div
                          key={event.id}
                          className={`absolute left-0 right-0 ${event.color} text-black p-1 text-xs overflow-hidden rounded`}
                          style={getEventStyle(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
