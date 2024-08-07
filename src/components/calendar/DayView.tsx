"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import EventDetailsModal from "./EventDetailModal";

interface DayViewProps {
  currentDate: Date | undefined;
  events: Event[];
  onEventUpdate: (updatedEvent: Event) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventUpdate,
}) => {
  const [date, setDate] = useState(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const formatTime = (hour: number) => {
    return `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`;
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

  const getDayEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date?.toDateString();
    });
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

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(event));
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const draggedEvent: Event = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.floor(y / 2) * 30;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const newStartDate = new Date(date || new Date());
    newStartDate.setHours(hours, remainingMinutes);

    const duration =
      new Date(draggedEvent.end.dateTime).getTime() -
      new Date(draggedEvent.start.dateTime).getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);

    const updatedEvent: Event = {
      ...draggedEvent,
      start: { ...draggedEvent.start, dateTime: newStartDate.toISOString() },
      end: { ...draggedEvent.end, dateTime: newEndDate.toISOString() },
    };

    onEventUpdate(updatedEvent);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      <div className="flex-grow overflow-auto scrollbar-hide scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="flex">
          <div className="w-24 flex-shrink-0 border-r dark:border-gray-700">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-[120px] text-right pr-2 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>
          <div
            className="flex-grow relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
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
            {getDayEvents().map((event, index) => {
              const startDate = new Date(event.start.dateTime);
              const endDate = new Date(event.end.dateTime);
              const eventColor = getEventColor(event);
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 hover:brightness-90 duration-300 cursor-move ${eventColor} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md ${
                    isDragging ? "opacity-50" : ""
                  }`}
                  style={getEventStyle(event)}
                  onClick={() => handleEventClick(event)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="font-bold truncate">{event.summary}</div>
                  <div className="text-xs opacity-80">
                    {formatTime(startDate.getHours())} -{" "}
                    {formatTime(endDate.getHours())}
                  </div>
                </div>
              );
            })}
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

export default DayView;
