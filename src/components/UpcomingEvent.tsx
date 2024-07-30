import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  title: string;
  time: string;
  description?: string;
  link?: string;
}

interface UpcomingEventProps {
  event: Event;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
  return (
    <Card className="mb-2 bg-purple-100 dark:bg-purple-900">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="text-xs">{event.time}</p>
        <p className="text-xs">{event.description}</p>
        {event.link && <p className="text-xs text-blue-600 dark:text-blue-400">{event.link}</p>}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvent;
