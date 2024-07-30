interface Event {
  id: number;
  title: string;
  day: number;
  start: number;
  duration: number;
  color: string;
}

interface TimeSlotProps {
  hour: number;
  dayIndex: number;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ hour, dayIndex }) => {
  const events: Event[] = [
    { id: 1, title: "Monday Wake Up", day: 1, start: 8, duration: 0.5, color: "bg-blue-200" },
    { id: 2, title: "All-Team Kickoff", day: 1, start: 9, duration: 1, color: "bg-blue-200" },
    { id: 3, title: "Financial Update", day: 1, start: 10, duration: 1, color: "bg-blue-200" },
    { id: 4, title: "New Employee Welcome Lunch!", day: 1, start: 11, duration: 1, color: "bg-purple-200" },
    { id: 5, title: "Design Review", day: 1, start: 13, duration: 2, color: "bg-blue-200" },
    { id: 6, title: "1:1 with Jon", day: 1, start: 14, duration: 1, color: "bg-orange-200" },
    { id: 7, title: "Design Review", day: 2, start: 9, duration: 1, color: "bg-blue-200" },
    { id: 8, title: "Figma - Acme Meetin...", day: 2, start: 9, duration: 1, color: "bg-green-200" },
    { id: 9, title: "Concept Design Review II", day: 2, start: 14, duration: 1, color: "bg-blue-200" },
    { id: 10, title: "Design System Kickoff Lunch", day: 2, start: 12, duration: 1, color: "bg-blue-200" },
    { id: 11, title: "Coffee Chat", day: 3, start: 9, duration: 1, color: "bg-blue-200" },
    { id: 12, title: "Onboarding Presentation", day: 3, start: 11, duration: 1, color: "bg-purple-200" },
    { id: 13, title: "MVP Prioritization Workshop", day: 3, start: 13, duration: 2, color: "bg-blue-200" },
    { id: 14, title: "Design Team Happy Hour", day: 3, start: 16, duration: 1, color: "bg-red-200" },
    { id: 15, title: "Coffee Chat", day: 5, start: 9, duration: 1, color: "bg-blue-200" },
    { id: 16, title: "Health Benefits Walkthrough", day: 5, start: 10, duration: 1, color: "bg-purple-200" },
    { id: 17, title: "Design Review", day: 5, start: 13, duration: 2, color: "bg-blue-200" },
    { id: 18, title: "Marketing Meet-and-Greet", day: 5, start: 12, duration: 1, color: "bg-blue-200" },
    { id: 19, title: "1:1 with Heather", day: 5, start: 14, duration: 1, color: "bg-orange-200" },
    { id: 20, title: "Happy Hour", day: 5, start: 16, duration: 1, color: "bg-red-200" },
  ];

  const eventsForTimeSlot = events.filter(event => event.day === dayIndex && event.start === hour);

  return (
    <>
      {eventsForTimeSlot.map(event => (
        <div
          key={event.id}
          className={`absolute left-0 right-0 ${event.color} p-1 text-xs overflow-hidden`}
          style={{
            top: '0',
            height: `${event.duration * 100}%`,
            zIndex: 10
          }}
        >
          {event.title}
        </div>
      ))}
    </>
  );
};

export default TimeSlot;
