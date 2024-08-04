"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/lib/types";
import { motion } from "framer-motion";
import EventDetailsModal from "./EventDetailModal";

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const [date, setDate] = useState(currentDate);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

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

  const getDates = () => {
    const dates = [];
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      dates.push(dayDate);
    }
    return dates;
  };

  const formatDateHeader = (date: Date) => {
    return `${weekDays[date.getDay()]} ${date.getDate()}`;
  };

  const formatTime = (hour: number, minute: number = 0) => {
    return `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  const getEventStyle = (event: Event) => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    const top = `${
      (startDate.getHours() * 60 + startDate.getMinutes()) * 2 + 4
    }px`;
    const height = `${
      (endDate.getTime() - startDate.getTime()) / (30 * 1000) - 8
    }px`;
    return { top, height };
  };

  const getEventColor = (event: Event) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return weekNo;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      {/* show week number here */}
      <div className="flex items-center justify-center p-4 border-b dark:border-gray-700">
        <div className="text-center">
          <p className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400">
            Week {getWeekNumber(date)}
          </p>
        </div>
      </div>
      <div
        className="flex-grow overflow-auto scrollbar-hide"
        ref={containerRef}
      >
        <div className="grid grid-cols-8 h-full min-w-[800px]">
          <div className="col-span-1 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-[120px] text-right pr-2 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div className="col-span-7 overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-7 h-full">
              {getDates().map((date, index) => (
                <div key={index} className="border-r dark:border-gray-700">
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 text-center border-b dark:border-gray-700 font-semibold">
                    {formatDateHeader(date)}
                  </div>
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-[120px] border-b dark:border-gray-700 relative"
                      >
                        <div
                          className="absolute left-0 w-full h-px bg-gray-200 dark:bg-gray-700"
                          style={{ top: "50%" }}
                        ></div>
                      </div>
                    ))}
                    {events
                      .filter((event) => {
                        const eventDate = new Date(event.start.dateTime);
                        return eventDate.toDateString() === date.toDateString();
                      })
                      .map((event, eventIndex) => {
                        const eventColor = getEventColor(event);
                        const startDate = new Date(event.start.dateTime);
                        const endDate = new Date(event.end.dateTime);
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: eventIndex * 0.1,
                            }}
                            className={`absolute left-1 right-1 ${eventColor} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md`}
                            style={getEventStyle(event)}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-bold text-wrap">
                              {event.summary}
                            </div>
                            <div className="text-xs opacity-80">
                              {formatTime(
                                startDate.getHours(),
                                startDate.getMinutes()
                              )}{" "}
                              -{" "}
                              {formatTime(
                                endDate.getHours(),
                                endDate.getMinutes()
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default WeekView;
