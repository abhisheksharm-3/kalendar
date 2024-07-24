"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  RiCalendarLine,
  RiUserLine,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/Settings";

interface Link {
  label: string;
  icon: React.ElementType;
  href?: string;
}

const LINKS: Link[] = [
  { label: "Profile", icon: RiUserLine },
  { label: "Settings", icon: RiSettings3Line },
  { label: "Logout", icon: RiLogoutBoxRLine },
];

const DAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function KalendarApp(): JSX.Element {
  const [date, setDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState<boolean>(false);
  const [showMobileCalendar, setShowMobileCalendar] =
    React.useState<boolean>(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <AppSidebar open={open} setOpen={setOpen} date={date} setDate={setDate} />
      <Dashboard
        date={date}
        setDate={setDate}
        showMobileCalendar={showMobileCalendar}
        setShowMobileCalendar={setShowMobileCalendar}
      />
      <MobileCalendarModal
        show={showMobileCalendar}
        onClose={() => setShowMobileCalendar(false)}
        date={date}
        setDate={setDate}
      />
    </div>
  );
}

interface AppSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  open,
  setOpen,
  date,
  setDate,
}) => (
  <Sidebar open={open} setOpen={setOpen} animate={false}>
    <SidebarBody className="justify-between gap-10">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Logo />
        <div className="mt-8 flex flex-col gap-2">
          <div className="hidden md:block">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate: Date | undefined) =>
                newDate && setDate(newDate)
              }
              className="rounded-md border"
            />
          </div>
          <SettingsDialog />
          {LINKS.map((link, idx) => (
            <SidebarLink
              key={idx}
              link={{
                ...link,
                href: "#",
                icon: (
                  <link.icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          ))}
        </div>
      </div>
      <SidebarLink
        link={{
          label: "User",
          href: "#",
          icon: (
            <RiUserLine className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
          ),
        }}
      />
    </SidebarBody>
  </Sidebar>
);

const Logo: React.FC = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <Image src="/logo.png" alt="Logo" width={170} height={100} />
  </Link>
);

interface DashboardProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  showMobileCalendar: boolean;
  setShowMobileCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<DashboardProps> = ({
  date,
  setDate,
  showMobileCalendar,
  setShowMobileCalendar,
}) => (
  <div className="flex flex-1 flex-col">
    <CalendarHeader date={date} setShowMobileCalendar={setShowMobileCalendar} />
    <div className="flex flex-1">
      <CalendarMain />
    </div>
  </div>
);

interface CalendarHeaderProps {
  date: Date;
  setShowMobileCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  setShowMobileCalendar,
}) => (
  <header className="flex items-center justify-between p-4 text-white">
    <div className="flex items-center space-x-4">
      <h2
        className="text-2xl font-bold cursor-pointer md:cursor-default"
        onClick={() => setShowMobileCalendar((prev) => !prev)}
      >
        {date.toLocaleString("default", { month: "long", year: "numeric" })}
      </h2>
      <div className="flex space-x-2">
        <IconButton icon={RiArrowLeftSLine} />
        <IconButton icon={RiArrowRightSLine} />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <select className="bg-gray-700 text-white px-3 py-1 rounded">
        <option>Week</option>
        <option>Day</option>
        <option>Month</option>
      </select>
      <button className="px-4 py-2 bg-gray-700 text-white rounded">
        Today
      </button>
      <input
        type="text"
        placeholder="Search"
        className="px-3 py-1 bg-gray-700 text-white rounded"
      />
    </div>
  </header>
);

interface IconButtonProps {
  icon: React.ElementType;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon }) => (
  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
    <Icon className="h-5 w-5" />
  </button>
);

const CalendarMain: React.FC = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 overflow-auto text-white">
      <div className="grid grid-cols-8 border-b border-gray-700">
        <div className="p-2"></div>
        {days.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium border-l border-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-700">
            <div className="p-2 text-right text-sm text-gray-500">
              {formatHour(hour)}
            </div>
            {days.map((_, index) => (
              <div key={index} className="border-l border-gray-700 h-16"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface MobileCalendarModalProps {
  show: boolean;
  onClose: () => void;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const MobileCalendarModal: React.FC<MobileCalendarModalProps> = ({
  show,
  onClose,
  date,
  setDate,
}) => {
  if (!show) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate: Date | undefined) => {
            if (newDate) {
              setDate(newDate);
              onClose();
            }
          }}
          className="rounded-md border"
        />
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface HourMarkerProps {
  hour: number;
}

const HourMarker: React.FC<HourMarkerProps> = ({ hour }) => (
  <div
    className="absolute w-full border-t border-gray-200 dark:border-gray-700"
    style={{ top: `${hour * 60}px` }}
  >
    <span className="absolute -top-3 -left-16 text-sm text-gray-500 dark:text-gray-400">
      {formatHour(hour)}
    </span>
  </div>
);

interface CalendarEventProps {
  top: number;
  left: number;
  title: string;
  color: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
  top,
  left,
  title,
  color,
}) => (
  <div
    className={`absolute p-2 rounded-md bg-${color}-200 dark:bg-${color}-800`}
    style={{
      top: `${top}px`,
      left: `${(left / 7) * 100}%`,
      width: `${100 / 7}%`,
      height: "60px",
    }}
  >
    {title}
  </div>
);

const formatHour = (hour: number): string =>
  hour === 0
    ? "12 AM"
    : hour < 12
    ? `${hour} AM`
    : hour === 12
    ? "12 PM"
    : `${hour - 12} PM`;
