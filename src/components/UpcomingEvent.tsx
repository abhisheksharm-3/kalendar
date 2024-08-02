import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";

interface UpcomingEventProps {
  event: Event;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timeRange = `${formatTime(event.start.dateTime)} - ${formatTime(event.end.dateTime)}`;

  return (
    <Card className="mb-2 bg-purple-100 dark:bg-purple-900">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium">{event.summary}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="text-xs">{timeRange}</p>
        {event.description && <p className="text-xs mt-1">{event.description}</p>}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvent;