"use client"
import React, { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearch2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Kalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('Week');

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

  const events = [
    { day: 1, startHour: 8, endHour: 9, title: "All-Team Kickoff", color: "bg-blue-500" },
    { day: 1, startHour: 10, endHour: 11, title: "Financial Update", color: "bg-blue-500" },
    { day: 1, startHour: 11, endHour: 12, title: "New Employee Welcome Lunch", color: "bg-purple-500" },
    { day: 1, startHour: 13, endHour: 14, title: "Design Review", color: "bg-blue-500" },
    { day: 1, startHour: 14, endHour: 15, title: "1:1 with Jon", color: "bg-orange-500" },
    { day: 2, startHour: 9, endHour: 10, title: "Design Review: Acme Market...", color: "bg-blue-500" },
    { day: 2, startHour: 12, endHour: 13, title: "Design System Kickoff Lunch", color: "bg-blue-500" },
    { day: 2, startHour: 14, endHour: 15, title: "Concept Design Review", color: "bg-blue-500" },
    { day: 2, startHour: 16, endHour: 17, title: "Design Team Happy Hour", color: "bg-red-500" },
    { day: 3, startHour: 9, endHour: 10, title: "Webinar: Coffee Chat", color: "bg-blue-500" },
    { day: 3, startHour: 13, endHour: 14, title: "MVP Prioritization Workshop", color: "bg-blue-500" },
    { day: 4, startHour: 9, endHour: 10, title: "Coffee Chat", color: "bg-blue-500" },
    { day: 4, startHour: 10, endHour: 11, title: "Health Benefits Walkthrough", color: "bg-purple-500" },
    { day: 4, startHour: 13, endHour: 14, title: "Design Review", color: "bg-blue-500" },
    { day: 5, startHour: 12, endHour: 13, title: "Marketing Meet-and-Greet", color: "bg-blue-500" },
    { day: 5, startHour: 14, endHour: 15, title: "1:1 with Heather", color: "bg-orange-500" },
    { day: 5, startHour: 16, endHour: 17, title: "Happy Hour", color: "bg-red-500" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-900 text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-neutral-800 p-4 border-r border-gray-200 dark:border-neutral-700">
        <h1 className="text-2xl font-bold mb-4">February 2021</h1>
        {/* Calendar component would go here */}
        <div className="mt-4">
          <h2 className="font-semibold mb-2">TODAY</h2>
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
            <p className="text-purple-700 dark:text-purple-300">All-Hands Company Meeting</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">8:30 - 9:00 AM</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <RiArrowLeftSLine className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RiArrowRightSLine className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={view}
              onValueChange={setView}
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </Select>
            <Button>Today</Button>
            <div className="relative">
              <RiSearch2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-neutral-700">
            <div className="p-2"></div>
            {days.map(day => (
              <div key={day} className="p-2 text-center font-medium border-l border-gray-200 dark:border-neutral-700">
                {day}
              </div>
            ))}
          </div>
          <div className="relative">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-200 dark:border-neutral-700">
                <div className="p-2 text-right text-sm text-gray-500">
                  {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                </div>
                {days.map((_, index) => (
                  <div key={index} className="border-l border-gray-200 dark:border-neutral-700 h-16"></div>
                ))}
              </div>
            ))}
            {events.map((event, index) => (
              <div
                key={index}
                className={`absolute ${event.color} text-white p-1 rounded overflow-hidden text-xs`}
                style={{
                  left: `${(event.day + 1) * 12.5}%`,
                  top: `${(event.startHour - 7) * 64 + 32}px`,
                  height: `${(event.endHour - event.startHour) * 64}px`,
                  width: '11%'
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kalendar;