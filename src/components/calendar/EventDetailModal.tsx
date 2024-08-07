"use client"
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Event } from '@/lib/types';
import { Clock, Calendar, MapPin, User, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-primary">{event.summary}</h2>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
        >
          <Clock className="w-6 h-6 text-primary" />
          <p>{formatDateTime(event.start.dateTime)} - {formatDateTime(event.end.dateTime)}</p>
        </motion.div>
        {event.description && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
          >
            <Info className="w-6 h-6 text-primary mt-1" />
            <p className="text-sm">{event.description}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Event Details</DialogTitle>
          </DialogHeader>
          <ModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left border-b pb-4">
          <DrawerTitle className="text-2xl font-bold text-primary">Event Details</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <ModalContent />
        </div>
        <DrawerClose asChild>
          <Button variant="outline" className="mx-auto mb-6">Close</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDetailsModal;