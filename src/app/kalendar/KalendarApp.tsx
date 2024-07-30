"use client"
import React, { useState } from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import WeekView from '@/components/WeekView';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const KalendarApp = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <LeftSidebar date={date} setDate={setDate} />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Today</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Day</Button>
            <Button variant="default">Week</Button>
            <Button variant="outline">Month</Button>
            <Button variant="outline">Year</Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-8" placeholder="Search" />
          </div>
        </div>
        <WeekView />
      </div>
    </div>
  );
};

export default KalendarApp;