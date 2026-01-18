import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { EventType } from '../lib/types';

interface DateRange {
    timeMin: string;
    timeMax: string;
}

/**
 * Get default date range: start of current month to end of next month
 */
function getDefaultDateRange(): DateRange {
    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();
    return { timeMin, timeMax };
}

async function fetchEvents(dateRange: DateRange): Promise<EventType[]> {
    const params = new URLSearchParams({
        timeMin: dateRange.timeMin,
        timeMax: dateRange.timeMax,
    });
    const response = await fetch(`/api/calendar/events/get?${params}`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

async function createEventApi(newEvent: Partial<EventType>): Promise<EventType> {
    const response = await fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
    });
    if (!response.ok) {
        throw new Error('Failed to create event');
    }
    return response.json();
}

async function updateEventApi(updatedEvent: EventType): Promise<EventType> {
    const response = await fetch('/api/calendar/events/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
    });
    if (!response.ok) {
        throw new Error('Failed to update event');
    }
    return response.json();
}

interface UseEventsOptions {
    /** Custom date range for filtering events */
    dateRange?: DateRange;
}

interface UseEventsReturnType {
    events: EventType[];
    isLoading: boolean;
    error: string | null;
    createEvent: (newEvent: Partial<EventType>) => Promise<EventType>;
    updateEvent: (updatedEvent: EventType) => Promise<EventType>;
    refetchEvents: () => Promise<void>;
}

/**
 * Hook for managing calendar events with React Query.
 * Provides automatic caching, background refetching, and optimistic updates.
 * 
 * @param options - Optional configuration including date range filter
 */
export function useEvents(options?: UseEventsOptions): UseEventsReturnType {
    const queryClient = useQueryClient();

    const dateRange = useMemo(
        () => options?.dateRange ?? getDefaultDateRange(),
        [options?.dateRange]
    );

    const queryKey = useMemo(
        () => ['events', dateRange.timeMin, dateRange.timeMax] as const,
        [dateRange]
    );

    const {
        data: events = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: () => fetchEvents(dateRange),
    });

    const createMutation = useMutation({
        mutationFn: createEventApi,
        onSuccess: (newEvent) => {
            queryClient.setQueryData<EventType[]>(queryKey, (old = []) => [
                ...old,
                newEvent,
            ]);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateEventApi,
        onSuccess: (updatedEvent) => {
            queryClient.setQueryData<EventType[]>(queryKey, (old = []) =>
                old.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );
        },
    });

    const createEvent = async (newEvent: Partial<EventType>): Promise<EventType> => {
        return createMutation.mutateAsync(newEvent);
    };

    const updateEvent = async (updatedEvent: EventType): Promise<EventType> => {
        return updateMutation.mutateAsync(updatedEvent);
    };

    const refetchEvents = async (): Promise<void> => {
        await refetch();
    };

    return {
        events,
        isLoading,
        error: error?.message ?? null,
        createEvent,
        updateEvent,
        refetchEvents,
    };
}
