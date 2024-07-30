import TimeSlot from './TimeSlot';

interface DayColumnProps {
  hour: number;
  dayIndex: number;
}

const DayColumn: React.FC<DayColumnProps> = ({ hour, dayIndex }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 relative">
      <TimeSlot hour={hour} dayIndex={dayIndex} />
    </div>
  );
};

export default DayColumn;
