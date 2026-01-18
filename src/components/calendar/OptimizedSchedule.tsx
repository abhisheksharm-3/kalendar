import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ScheduleResponseType } from '@/lib/types';

interface OptimizedScheduleProps {
  schedule: ScheduleResponseType;
  explanation: string;
  suggestion: string;
  onReset: () => void;
  onImplement: (schedule: ScheduleResponseType) => void;
}

/**
 * Displays an AI-generated optimized schedule with insights and action buttons.
 */
export default function OptimizedSchedule({
  schedule,
  explanation,
  suggestion,
  onReset,
  onImplement,
}: OptimizedScheduleProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  const handleImplement = useCallback(() => {
    onImplement(schedule);
  }, [onImplement, schedule]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Optimized Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {schedule.schedule.map((event, index) => (
              <li
                key={index}
                className="bg-secondary p-2 rounded flex justify-between items-center"
              >
                <span className="font-medium">{event.summary}</span>
                <span className="text-gray-500">
                  {new Date(event.start.dateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(event.end.dateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Collapsible open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between items-center">
            KAI Insights
            {isInsightsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <p className="mb-2">
                <strong>Explanation:</strong> {explanation}
              </p>
              <p>
                <strong>Suggestion:</strong> {suggestion}
              </p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-2">
        <Button onClick={handleImplement} className="w-full">
          Implement this Schedule
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full">
          Get New Schedule
        </Button>
      </div>
    </div>
  );
}