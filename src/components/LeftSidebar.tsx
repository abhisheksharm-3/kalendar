import { Calendar } from "@/components/ui/calendar";
import UpcomingEvent from './UpcomingEvent';

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
  const upcomingEvents: Event[] = [
    { id: 1, title: "All Hands Company Meeting", time: "8:30 - 9:00 AM", description: "Monthly catch-up" },
    { id: 2, title: "Quarterly review", time: "9:30 - 10:00 AM", link: "https://zoom.us/j/1234567890" },
    { id: 3, title: "Visit to discuss improvements", time: "8:30 - 9:00 AM", link: "https://zoom.us/j/0987654321" },
    { id: 4, title: "Presentation on new products and cost structure", time: "8:30 - 9:00 AM" },
    { id: 5, title: "City Sales Pitch", time: "8:30 - 9:00 AM", link: "https://zoom.us/j/1357924680" },
  ];

  return (
    <div className="w-80 p-4 bg-gray-200 dark:bg-gray-800">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">February 2021</h1>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">TODAY 2/27/2021</h2>
        {upcomingEvents.map((event) => (
          <UpcomingEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
