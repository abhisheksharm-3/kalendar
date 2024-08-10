"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OptimizedSchedule from './OptimizedSchedule';
import { RiCalendarLine } from '@remixicon/react';
import axios, { AxiosError } from 'axios';
import { Schedule } from '@/lib/types';
import { toast } from 'sonner';

const scheduleRequestSchema = z.object({
  date: z.string().min(1, "Date is required"),
  comments: z.string().optional(),
});

type ScheduleRequestData = z.infer<typeof scheduleRequestSchema>;

interface AIScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSchedule: (data: ScheduleRequestData) => Promise<void>;
}

const AIScheduleModal: React.FC<AIScheduleModalProps> = ({ isOpen, onOpenChange, onRequestSchedule }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [schedule, setSchedule] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ScheduleRequestData>({
    resolver: zodResolver(scheduleRequestSchema),
    defaultValues: {
      date: '',
      comments: '',
    },
  });

  const onSubmit = async (data: ScheduleRequestData) => {
    setIsLoading(true);
    try {
      const result = await onRequestSchedule(data);
      setSchedule(result);
    } catch (error) {
      console.error('Error requesting schedule:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setSchedule(null);
  };

  const implementSchedule = async (schedule: Schedule) => {
    if (schedule.schedule) {
      console.log('Implementing schedule:', schedule.schedule);
  
      for (const event of schedule.schedule) {
        try {
          // First, try to update the event
          await axios.put<void>('/api/calendar/events/update', event);
          toast.success(`Event "${event.summary}" has been updated.`, {
            action: {
              label: 'View',
              onClick: () => console.log("Success"),
            }
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 500) {
            try {
              await axios.post<void>('/api/calendar/events/create', event);
              toast.success(`Event "${event.summary}" has been created.`, {
                action: {
                  label: 'View',
                  onClick: () => console.log("Success"),
                }
              });
            } catch (createError) {
              handleEventError(createError, event, 'creating');
            }
          } else {
            handleEventError(error, event, 'updating');
          }
        }
      }
    }
  };

  const handleEventError = (error: unknown, event: any, action: string) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      toast.error(`Error ${action} event "${event.summary}": ${axiosError.message}`, {
        action: {
          label: 'Dismiss',
          onClick: () => console.log("Dismiss"),
        }
      });
    } else {
      toast.error(`Unexpected error ${action} event "${event.summary}": ${error}`, {
        action: {
          label: 'Dismiss',
          onClick: () => console.log("error"),
        }
      });
    }
  };

  const ScheduleForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <RiCalendarLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input type="date" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific requirements or preferences?" {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating Schedule...' : 'Get AI Schedule'}
        </Button>
      </form>
    </Form>
  );

  const content = schedule ? (
    <OptimizedSchedule
      schedule={schedule}
      explanation={schedule.explanation}
      suggestion={schedule.suggestion}
      onReset={resetForm}
      onImplement={implementSchedule}
    />
  ) : (
    <ScheduleForm />
  );

  const ModalContent = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select a date and provide any additional comments for your AI-optimized schedule.</p>
      {content}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>AI-Assisted Scheduling</DialogTitle>
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
          <DrawerTitle>AI-Assisted Scheduling</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2 overflow-y-auto scrollbar-hide max-h-[calc(100vh-10rem)]">
          <ModalContent />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AIScheduleModal;