"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    RiCalendarLine,
    RiUserLine,
    RiSettings3Line,
    RiLogoutBoxRLine,
    RiArrowLeftSLine,
    RiArrowRightSLine
} from "@remixicon/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function KalendarApp() {
  const links = [
    {
      label: "Calendar",
      href: "#",
      icon: (
        <RiCalendarLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <RiUserLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <RiSettings3Line className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <RiLogoutBoxRLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 w-screen mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "User",
                href: "#",
                icon: (
                  <RiUserLine className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={170}
        height={100}
        className="" />
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
// ... (previous code remains the same)

// Updated Dashboard component with Google Calendar-like UI
const Dashboard = () => {
    return (
      <div className="flex flex-1 flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <CalendarSidebar />
          <CalendarMain />
        </div>
      </div>
    );
  };
  
  const CalendarHeader = () => {
    return (
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Today</button>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <RiArrowLeftSLine className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <RiArrowRightSLine className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">July 2024</h2>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Day</button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Week</button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Month</button>
        </div>
      </header>
    );
  };
  
  const CalendarSidebar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map(day => (
            <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">{day}</div>
          ))}
          {[...Array(35)].map((_, i) => (
            <div key={i} className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const CalendarMain = () => {
    const hours = [...Array(24)].map((_, i) => i);
    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 bg-white dark:bg-gray-800 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: `${24 * 60}px` }}>
          {hours.map(hour => (
            <div key={hour} className="absolute w-full border-t border-gray-200 dark:border-gray-700" style={{ top: `${hour * 60}px` }}>
              <span className="absolute -top-3 -left-16 text-sm text-gray-500 dark:text-gray-400">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            </div>
          ))}
          {/* Dummy events */}
          <div className="absolute top-180 left-1/7 w-1/7 h-60 bg-blue-200 dark:bg-blue-800 p-2 rounded-md">
            Meeting with Team
          </div>
          <div className="absolute top-600 left-3/7 w-1/7 h-90 bg-green-200 dark:bg-green-800 p-2 rounded-md">
            Lunch with Client
          </div>
        </div>
      </div>
    );
  };
  
  // ... (rest of the code remains the same)