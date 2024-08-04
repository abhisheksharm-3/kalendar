"use client"
import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Event } from '@/lib/types';
import EventDetailsModal from './EventDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-primary">
        <Calendar className="w-6 h-6" />
        <h3 className="text-xl font-semibold">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
        </h3>
      </div>
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No events scheduled for this day.</p>
      ) : (
        <AnimatePresence>
          <ul className="space-y-4">
            {filteredEvents.map((event, index) => (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleEventClick(event)}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <h4 className="font-semibold text-lg mb-2">{event.summary}</h4>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <p>
                    {format(new Date(event.start.dateTime), 'h:mm a')} - {format(new Date(event.end.dateTime), 'h:mm a')}
                  </p>
                </div>
                {event.description && (
                  <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{event.description}</p>
                )}
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Day Events</DialogTitle>
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
        <DrawerHeader className="text-left border-b pb-4">
          <DrawerTitle className="text-2xl font-bold text-primary">Day Events</DrawerTitle>
          <DrawerDescription>
            View and manage your events for the selected day.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6">
          <ModalContent />
        </div>
        <DrawerClose asChild>
          <Button variant="outline" className="mx-auto mb-6">Close</Button>
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