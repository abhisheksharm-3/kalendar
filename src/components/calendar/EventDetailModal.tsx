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
import { Clock, Calendar, MapPin, User, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

interface EventDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEventUpdate: (updatedEvent: Event) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onOpenChange, event, onEventUpdate }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);

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
  
    try {
      const formatDate = (dateString: string, timeZone: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
      };
  
      const eventData = {
        id: editedEvent.id,
        summary: editedEvent.summary,
        description: editedEvent.description,
        start: {
          dateTime: formatDate(editedEvent.start.dateTime, editedEvent.start.timeZone),
          timeZone: 'Asia/Kolkata' // Explicitly set to IST
        },
        end: {
          dateTime: formatDate(editedEvent.end.dateTime, editedEvent.end.timeZone),
          timeZone: 'Asia/Kolkata' // Explicitly set to IST
        }
      };
  
      console.log('Sending event data:', eventData); // For debugging
  
      const response = await axios.put('/api/calendar/events/update', eventData);
      
      if (response.data && response.data.id) {
        onEventUpdate(response.data);
        setIsEditing(false);
        toast.success('Event updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        toast.error(`Failed to update event: ${error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to update event: Network error');
      }
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
      {isEditing ? (
        <div className="space-y-4">
          <Input
            name="summary"
            value={editedEvent?.summary}
            onChange={handleInputChange}
            placeholder="Event Title"
          />
          <div className="flex lg:space-x-2 space-y-2 lg:space-y-0 flex-col lg:flex-row">
            <Input
              name="start"
              type="datetime-local"
              value={formatDateTime(editedEvent?.start.dateTime || '')}
              onChange={handleInputChange}
            />
            <Input
              name="end"
              type="datetime-local"
              value={formatDateTime(editedEvent?.end.dateTime || '')}
              onChange={handleInputChange}
            />
          </div>
          <Textarea
            name="description"
            value={editedEvent?.description}
            onChange={handleInputChange}
            placeholder="Event Description"
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <>
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
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <Info className="w-6 h-6 text-primary mt-1" />
                <p className="text-sm">{event.description}</p>
              </motion.div>
            )}
          </div>
          <Button onClick={handleEdit} className="mt-4">Edit Event</Button>
        </>
      )}
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