import React from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { Event } from '@/lib/types';

const formatTime = (hour: number, minute: number = 0) => {
  return `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
};

interface DraggableEventProps {
  eventColor: string;
  event: Event;
  index: number;
  onClick: () => void;
  style: React.CSSProperties;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({
  eventColor,
  event,
  index,
  onClick,
  style,
}) => {
  const startDate = new Date(event.start.dateTime);
  const endDate = new Date(event.end.dateTime);

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided: DraggableProvided) => {
        const combinedStyle: React.CSSProperties = {
          ...provided.draggableProps.style,
          ...style,
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`absolute left-1 right-1 ${eventColor} text-white p-2 text-xs overflow-hidden rounded-lg shadow-md`}
            style={combinedStyle}
            onClick={onClick}
          >
            <div className="font-bold break-words">{event.summary}</div>
            <div className="text-xs opacity-80">
              {formatTime(startDate.getHours(), startDate.getMinutes())} -{' '}
              {formatTime(endDate.getHours(), endDate.getMinutes())}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableEvent;