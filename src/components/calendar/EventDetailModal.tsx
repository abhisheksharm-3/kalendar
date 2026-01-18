'use client';

import React, { useState, useCallback } from 'react';
import { useMediaQuery } from '@/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import type { EventType } from '@/lib/types';
import { Clock, Info, Edit, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface EventDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventType | null;
  onEventUpdate?: (event: EventType) => Promise<EventType>;
}

/**
 * Formats a datetime string to the format required by datetime-local input.
 */
function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export default function EventDetailsModal({
  isOpen,
  onOpenChange,
  event,
  onEventUpdate,
}: EventDetailsModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = useCallback(() => {
    setEditedEvent(event);
    setIsEditing(true);
  }, [event]);

  const handleSave = useCallback(async () => {
    if (!editedEvent || !onEventUpdate) return;
    setIsLoading(true);

    try {
      const eventData: EventType = {
        ...editedEvent,
        start: {
          dateTime: new Date(editedEvent.start.dateTime).toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(editedEvent.end.dateTime).toISOString(),
          timeZone: 'Asia/Kolkata',
        },
      };

      await onEventUpdate(eventData);
      setIsEditing(false);
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error(
        `Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [editedEvent, onEventUpdate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!editedEvent) return;

      const { name, value } = e.target;
      if (name === 'start' || name === 'end') {
        setEditedEvent({
          ...editedEvent,
          [name]: { ...editedEvent[name], dateTime: value },
        });
      } else {
        setEditedEvent({ ...editedEvent, [name]: value });
      }
    },
    [editedEvent]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  if (!event) return null;

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
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start
                </label>
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
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  End
                </label>
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={editedEvent?.description || ''}
                onChange={handleInputChange}
                placeholder="Event Description"
                className="w-full h-32"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center" disabled={isLoading}>
                {isLoading ? (
                  'Saving...'
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
                <p>
                  {format(new Date(event.start.dateTime), "MMMM d, yyyy 'at' h:mm a")} -{' '}
                  {format(new Date(event.end.dateTime), 'h:mm a')}
                </p>
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
            {onEventUpdate && (
              <Button
                onClick={handleEdit}
                className="mt-6 w-full sm:w-auto flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Event
              </Button>
            )}
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
            <Button variant="outline" className="mx-auto mb-6">
              Close
            </Button>
          </DrawerClose>
        )}
      </DrawerContent>
    </Drawer>
  );
}