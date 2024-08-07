"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Event } from '@/lib/types';

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  description: z.string().optional(),
  recurrence: z.enum(["none", "FREQ=DAILY", "FREQ=WEEKLY", "FREQ=MONTHLY"]),
  useDefaultReminder: z.boolean(),
  reminder: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventCreationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: any) => Promise<Event>;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({ isOpen, onOpenChange, onCreateEvent }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      start: '',
      end: '',
      description: '',
      recurrence: 'none',
      useDefaultReminder: true,
      reminder: '',
    },
  });

  const onSubmit = (data: EventFormData) => {
    const newEvent = {
      summary: data.title,
      description: data.description,
      start: { dateTime: new Date(data.start).toISOString() },
      end: { dateTime: new Date(data.end).toISOString() },
      recurrence: data.recurrence !== 'none' ? [`RRULE:${data.recurrence}`] : undefined,
      reminders: {
        useDefault: data.useDefaultReminder,
        overrides: data.useDefaultReminder ? undefined : [{ method: 'popup', minutes: parseInt(data.reminder || "0") }],
      },
    };
    onCreateEvent(newEvent);
    onOpenChange(false);
  };

  const EventForm = ({ className }: React.ComponentProps<"form">) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurrence</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No recurrence</SelectItem>
                  <SelectItem value="FREQ=DAILY">Daily</SelectItem>
                  <SelectItem value="FREQ=WEEKLY">Weekly</SelectItem>
                  <SelectItem value="FREQ=MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="useDefaultReminder"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use default reminder</FormLabel>
                <FormDescription>
                  Use the default reminder settings for this event.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {!form.watch('useDefaultReminder') && (
          <FormField
            control={form.control}
            name="reminder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder time (minutes before event)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter minutes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <DialogFooter>
          <Button type="submit" className="w-full">Create Event</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm className="space-y-6" />
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
        <EventForm className="px-4 space-y-6" />
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