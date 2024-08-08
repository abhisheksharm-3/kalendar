import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event, Schedule } from '@/lib/types';

interface OptimizedScheduleProps {
  schedule: Schedule;
  explanation: string;
  suggestion: string;
  onReset: () => void;
  onImplement: (schedule: Schedule) => void;
}

const OptimizedSchedule: React.FC<OptimizedScheduleProps> = ({
  schedule,
  explanation,
  suggestion,
  onReset,
  onImplement,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Optimized Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {schedule.schedule.map((event, index) => (
              <li key={index} className="bg-secondary p-2 rounded">
                <strong>{event.summary}</strong>: {new Date(event.start.dateTime).toLocaleTimeString()} - {new Date(event.end.dateTime).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KAI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Explanation:</strong> {explanation}</p>
          <p><strong>Suggestion:</strong> {suggestion}</p>
        </CardContent>
      </Card>
      <Button onClick={() => onImplement(schedule)} className="w-full">
        Implement this Schedule
      </Button>
      <Button onClick={onReset} className="w-full">
        Get New Schedule
      </Button>
    </div>
  );
};

export default OptimizedSchedule;