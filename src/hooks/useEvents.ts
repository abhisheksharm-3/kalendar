import { useState, useEffect } from 'react';
import { Event } from '../lib/types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/calendar/events/get');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data: Event[] = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (newEvent: Omit<Event, 'id'>) => {
    try {
      const response = await fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error('Failed to create event');

      const createdEvent: Event = await response.json();
      setEvents(prevEvents => [...prevEvents, createdEvent]);
      return createdEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch('/api/calendar/events/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error('Failed to update event');

      const updatedEventData: Event = await response.json();
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === updatedEventData.id ? updatedEventData : event
      ));
      return updatedEventData;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  return { events, isLoading, error, createEvent, updateEvent, refetchEvents: fetchEvents };
};