import React from "react";
import EventForm from "./EventForm";
import { Event } from '@/lib/types';
import CalendarEvent from "./CalendarEvent";
import AIEventSuggestion from "./AIEventSuggestion";

interface CalendarMainProps {
    date: Date;  // Add this prop to be consistent with the Dashboard component
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    aiMode: boolean;
}

const formatHour = (hour: number): string =>
    hour === 0
        ? "12 AM"
        : hour < 12
            ? `${hour} AM`
            : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;

const CalendarMain: React.FC<CalendarMainProps> = ({ date, events, setEvents, aiMode }) => {
    const [showEventForm, setShowEventForm] = React.useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = React.useState<{ day: number, hour: number } | null>(null);

    const handleSlotClick = (day: number, hour: number) => {
        setSelectedSlot({ day, hour });
        setShowEventForm(true);
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="flex-1 overflow-auto text-white">
            <div className="grid grid-cols-8 border-b border-gray-700">
                <div className="p-2"></div>
                {days.map((day) => (
                    <div key={day} className="p-2 text-center font-medium border-l border-gray-700">
                        {day}
                    </div>
                ))}
            </div>
            <div className="relative">
                {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-gray-700">
                        <div className="p-2 text-right text-sm text-gray-500">
                            {formatHour(hour)}
                        </div>
                        {days.map((_, index) => (
                            <div 
                                key={index} 
                                className="border-l border-gray-700 h-16"
                                onClick={() => handleSlotClick(index, hour)}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            {events.map((event, index) => (
                <CalendarEvent key={index} event={event} />
            ))}
            {aiMode && <AIEventSuggestion />}
            {showEventForm && selectedSlot && (
                <EventForm
                    onClose={() => setShowEventForm(false)}
                    onSave={(newEvent) => {
                        setEvents([...events, newEvent]);
                        setShowEventForm(false);
                    }}
                    initialDay={selectedSlot.day}
                    initialHour={selectedSlot.hour}
                />
            )}
        </div>
    );
};

export default CalendarMain;