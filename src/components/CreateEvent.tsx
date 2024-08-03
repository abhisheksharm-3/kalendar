"use client"
import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Checkbox, Textarea } from '@nextui-org/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventCreationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: any) => Promise<void>;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({ isOpen, onOpenChange, onCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [reminder, setReminder] = useState('');
  const [useDefaultReminder, setUseDefaultReminder] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      summary: title,
      description,
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
      recurrence: recurrence !== 'none' ? [`RRULE:${recurrence}`] : undefined,
      reminders: {
        useDefault: useDefaultReminder,
        overrides: useDefaultReminder ? undefined : [{ method: 'popup', minutes: parseInt(reminder) }],
      },
    };
    onCreateEvent(newEvent);
    onOpenChange(false);
  };

  const EventForm = ({ className }: React.ComponentProps<"form">) => (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" placeholder="Enter event title" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start" className="block text-sm font-medium mb-1">Start Date & Time</Label>
          <Input id="start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full" />
        </div>
        <div>
          <Label htmlFor="end" className="block text-sm font-medium mb-1">End Date & Time</Label>
          <Input id="end" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full" />
        </div>
      </div>
      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" placeholder="Event description" />
      </div>
      <div>
        <Label htmlFor="recurrence" className="block text-sm font-medium mb-1">Recurrence</Label>
        <Select value={recurrence} onValueChange={setRecurrence}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No recurrence</SelectItem>
            <SelectItem value="FREQ=DAILY">Daily</SelectItem>
            <SelectItem value="FREQ=WEEKLY">Weekly</SelectItem>
            <SelectItem value="FREQ=MONTHLY">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-sm font-medium mb-1">Reminder</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useDefaultReminder"
            isSelected={useDefaultReminder}
            onValueChange={(checked) => setUseDefaultReminder(checked)}
          />
          <label htmlFor="useDefaultReminder" className="text-sm">Use default reminder</label>
        </div>
      </div>
      {!useDefaultReminder && (
        <div>
          <Label htmlFor="reminderTime" className="block text-sm font-medium mb-1">Reminder time (minutes before event)</Label>
          <Input
            id="reminderTime"
            type="number"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="w-full"
            placeholder="Enter minutes"
          />
        </div>
      )}
      <DialogFooter>
        <Button type="submit" className="w-full">Create Event</Button>
      </DialogFooter>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Event</DrawerTitle>
          <DrawerDescription>
            Fill in the details for your new event.
          </DrawerDescription>
        </DrawerHeader>
        <EventForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EventCreationModal;