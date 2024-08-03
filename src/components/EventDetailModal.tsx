"use client"
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Event } from '@/lib/types';
import { Clock, Calendar, MapPin, User, Info } from 'lucide-react';

interface EventDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onOpenChange, event }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!event) return null;

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  const ModalContent = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{event.summary}</h2>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <p>{formatDateTime(event.start.dateTime)} - {formatDateTime(event.end.dateTime)}</p>
        </div>
        {event.description && (
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-gray-500 mt-1" />
            <p className="text-sm">{event.description}</p>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <p>Organizer: {event.organizer.email}</p>
        </div>
        {/* {event.attendees && (
          <div className="flex items-start space-x-2">
            <User className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="font-semibold">Attendees:</p>
              <ul className="list-disc list-inside">
                {event.attendees.map((attendee, index) => (
                  <li key={index} className="text-sm">{attendee.email}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {event.recurrence && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <p>Recurring event</p>
          </div>
        )} */}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <ModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Event Details</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <ModalContent />
        </div>
        <DrawerClose asChild>
          <Button variant="outline" className="mx-4 mb-4 mt-6">Close</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDetailsModal;