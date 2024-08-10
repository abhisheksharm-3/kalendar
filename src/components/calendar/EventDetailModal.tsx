"use client"
import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parse } from 'date-fns';
import { Event } from '@/lib/types';
import { Clock, Calendar, MapPin, User, Info, Edit, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { useEvents } from '@/hooks/useEvents';

interface EventDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onOpenChange, event }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateEvent } = useEvents();

  if (!event) return null;

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleEdit = () => {
    setEditedEvent(event);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedEvent) return;
    setIsLoading(true);
  
    try {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString();
      };
  
      const eventData = {
        ...editedEvent,
        start: {
          dateTime: formatDate(editedEvent.start.dateTime),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: formatDate(editedEvent.end.dateTime),
          timeZone: 'Asia/Kolkata'
        }
      };
  
      await updateEvent(eventData);
      setIsEditing(false);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedEvent) return;

    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      setEditedEvent({
        ...editedEvent,
        [name]: { ...editedEvent[name], dateTime: value }
      });
    } else {
      setEditedEvent({ ...editedEvent, [name]: value });
    }
  };

  const ModalContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Input
              name="summary"
              value={editedEvent?.summary}
              onChange={handleInputChange}
              placeholder="Event Title"
              className="text-lg font-semibold"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start</label>
                <Input
                  id="start-date"
                  name="start"
                  type="datetime-local"
                  value={formatDateTime(editedEvent?.start.dateTime || '')}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
                <Input
                  id="end-date"
                  name="end"
                  type="datetime-local"
                  value={formatDateTime(editedEvent?.end.dateTime || '')}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <Textarea
                id="description"
                name="description"
                value={editedEvent?.description}
                onChange={handleInputChange}
                placeholder="Event Description"
                className="w-full h-32"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex items-center" disabled={isLoading}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner mr-2"></span> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                <p>{format(new Date(event.start.dateTime), "MMMM d, yyyy 'at' h:mm a")} - {format(new Date(event.end.dateTime), "h:mm a")}</p>
              </motion.div>
              {event.description && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                >
                  <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm">{event.description}</p>
                </motion.div>
              )}
            </div>
            <Button onClick={handleEdit} className="mt-6 w-full sm:w-auto flex items-center justify-center">
              <Edit className="w-4 h-4 mr-2" /> Edit Event
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
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
        {!isEditing && (
          <DrawerClose asChild>
            <Button variant="outline" className="mx-auto mb-6">Close</Button>
          </DrawerClose>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default EventDetailsModal;