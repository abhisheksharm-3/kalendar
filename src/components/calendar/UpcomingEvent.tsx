'use client';

import type { EventType } from '@/lib/types';
import { Clock } from 'lucide-react';

interface UpcomingEventProps {
  event: EventType;
}

const EVENT_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
];

function getEventColor(eventId: string): string {
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length];
}

/**
 * Displays a single upcoming event in a modern card format.
 */
export default function UpcomingEvent({ event }: UpcomingEventProps) {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const colorClass = getEventColor(event.id);

  return (
    <div className="group relative p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-200 cursor-pointer">
      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div className={`w-1 h-full min-h-[40px] rounded-full ${colorClass}`} />

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {event.summary}
          </h4>

          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}
            </span>
          </div>

          {event.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}