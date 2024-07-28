interface CalendarEventProps {
  event: Event;
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  day: number;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  const { title, startTime, endTime, day } = event;

  // Calculate position and size
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  const duration = endHour - startHour;
  
  const top = startHour * 60; // Assuming each hour is 60px tall
  const height = duration * 60;
  const left = (day - 1) * (100 / 7); // Assuming 7 days in the view

  // Generate a consistent color based on the event title
  const colorHash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo'];
  const color = colors[colorHash % colors.length];

  return (
    <div
      className={`absolute p-2 rounded-md bg-${color}-200 dark:bg-${color}-800 text-${color}-800 dark:text-${color}-200 overflow-hidden`}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        width: `${100 / 7}%`,
        height: `${height}px`,
      }}
    >
      <div className="font-bold">{title}</div>
      <div className="text-sm">
        {startTime} - {endTime}
      </div>
    </div>
  );
};

export default CalendarEvent;