import React from 'react';
import DayColumn from './DayColumn';

const WeekView: React.FC = () => {
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 7); // 7 AM to 5 PM

  return (
    <div className="grid grid-cols-8 gap-2">
      <div></div> {/* Empty cell for time column */}
      {weekDays.map((day, index) => (
        <div key={day} className="text-center font-semibold">
          <div>{day}</div>
          <div>{21 + index}</div>
        </div>
      ))}
      {timeSlots.map((hour) => (
        <React.Fragment key={hour}>
          <div className="text-right pr-2">{`${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`}</div>
          {weekDays.map((_, dayIndex) => (
            <DayColumn key={`${hour}-${dayIndex}`} hour={hour} dayIndex={dayIndex} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekView;
