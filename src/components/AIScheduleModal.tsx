"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OptimizedSchedule from './OptimizedSchedule';

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

  const form = useForm<ScheduleRequestData>({
    resolver: zodResolver(scheduleRequestSchema),
    defaultValues: {
      date: '',
      comments: '',
    },
  });

  const onSubmit = async (data: ScheduleRequestData) => {
    try {
      const result = await onRequestSchedule(data);
      setSchedule(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error requesting schedule:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const resetForm = () => {
    form.reset();
    setSchedule(null);
  };

  const ScheduleForm = ({ className }: React.ComponentProps<"form">) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
                <Textarea placeholder="Any specific requirements or preferences?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Get AI Schedule</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  const content = schedule ? (
    <OptimizedSchedule
      schedule={schedule.schedule}
      explanation={schedule.explanation}
      suggestion={schedule.suggestion}
      onReset={resetForm}
    />
  ) : (
    <ScheduleForm className="space-y-6" />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI-Assisted Scheduling</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>AI-Assisted Scheduling</DrawerTitle>
          <DrawerDescription>
            Select a date and provide any additional comments for your AI-optimized schedule.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2">
          {content}
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