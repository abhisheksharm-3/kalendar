import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

interface CalendarHeaderProps {
    date: Date;
    setShowMobileCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  }
  interface IconButtonProps {
    icon: React.ElementType;
  }
  const IconButton: React.FC<IconButtonProps> = ({ icon: Icon }) => (
    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
      <Icon className="h-5 w-5" />
    </button>
  );
const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date, setShowMobileCalendar }) => (
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
        <button className="px-4 py-2 bg-gray-700 text-white rounded">Today</button>
        <input type="text" placeholder="Search" className="px-3 py-1 bg-gray-700 text-white rounded" />
      </div>
    </header>
  );

  export default CalendarHeader;