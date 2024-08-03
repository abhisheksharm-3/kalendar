"use client"
import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Event } from '@/lib/types';
import EventDetailsModal from './EventDetailModal';

interface DayEventsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  events: Event[];
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({ isOpen, onOpenChange, selectedDate, events }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start.dateTime);
    return selectedDate && eventDate.toDateString() === selectedDate.toDateString();
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const ModalContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
      </h3>
      {filteredEvents.length === 0 ? (
        <p>No events scheduled for this day.</p>
      ) : (
        <ul className="space-y-2">
          {filteredEvents.map((event) => (
            <li key={event.id} onClick={() => handleEventClick(event)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <h4 className="font-medium">{event.summary}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(event.start.dateTime), 'h:mm a')} - {format(new Date(event.end.dateTime), 'h:mm a')}
              </p>
              {event.description && (
                <p className="text-sm mt-1">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Day Events</DialogTitle>
          </DialogHeader>
          <ModalContent />
        </DialogContent>
        <EventDetailsModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
      />
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Day Events</DrawerTitle>
          <DrawerDescription>
            View events for the selected day.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <ModalContent />
        </div>
        <DrawerClose asChild>
          <Button variant="outline" className="mx-4 mb-4">Close</Button>
        </DrawerClose>
      </DrawerContent>
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
      />
    </Drawer>
  );
};

export default DayEventsModal;