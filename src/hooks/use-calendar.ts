import { useState, useCallback } from 'react';
import type { CalendarViewType } from '../lib/types';

interface UseCalendarReturnType {
    date: Date | undefined;
    view: CalendarViewType;
    goToToday: () => void;
    goToPrevious: () => void;
    goToNext: () => void;
    setDate: (date: Date | undefined) => void;
    setView: (view: CalendarViewType) => void;
}

/**
 * Hook for managing calendar navigation and view state.
 */
export function useCalendar(): UseCalendarReturnType {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [view, setView] = useState<CalendarViewType>('week');

    const goToToday = useCallback(() => {
        setDate(new Date());
    }, []);

    const goToPrevious = useCallback(() => {
        setDate((prevDate) => {
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
    }, [view]);

    const goToNext = useCallback(() => {
        setDate((prevDate) => {
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
    }, [view]);

    return {
        date,
        view,
        goToToday,
        goToPrevious,
        goToNext,
        setDate,
        setView,
    };
}
