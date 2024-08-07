import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import LeftSidebar from '@/components/calendar/LeftSidebar';
import { Event } from '@/lib/types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: Event[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, date, setDate, events }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 md:hidden"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <motion.div
          className="relative w-80 h-full bg-white dark:bg-gray-800 shadow-lg"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="top-4 right-4"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <LeftSidebar
            date={date}
            setDate={setDate}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);