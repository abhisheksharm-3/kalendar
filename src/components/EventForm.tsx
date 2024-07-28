// EventForm.tsx
import React from 'react';
import { Event } from '@/lib/types';

interface EventFormProps {
    onClose: () => void;
    onSave: (event: Omit<Event, 'id'>) => void;
    initialDay: number;
    initialHour: number;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSave, initialDay, initialHour }) => {
    const [title, setTitle] = React.useState<string>('');
    const [startTime, setStartTime] = React.useState<string>(`${initialHour}:00`);
    const [endTime, setEndTime] = React.useState<string>(`${initialHour + 1}:00`);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            day: initialDay,
            startTime,
            endTime,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                    className="mb-2 w-full p-2 border rounded"
                />
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;