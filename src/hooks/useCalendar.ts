import { useState } from 'react';

type CalendarView = 'day' | 'week' | 'month';

export const useCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<CalendarView>('week');

  const goToToday = () => setDate(new Date());

  const goToPrevious = () => {
    setDate(prevDate => {
      const newDate = prevDate ? new Date(prevDate) : new Date();
      switch (view) {
        case 'day':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
      }
      return newDate;
    });
  };

  const goToNext = () => {
    setDate(prevDate => {
      const newDate = prevDate ? new Date(prevDate) : new Date();
      switch (view) {
        case 'day':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
      }
      return newDate;
    });
  };

  return { date, view, goToToday, goToPrevious, goToNext, setDate, setView };
};