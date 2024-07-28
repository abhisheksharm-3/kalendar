interface HourMarkerProps {
    hour: number;
}
const formatHour = (hour: number): string =>
    hour === 0
        ? "12 AM"
        : hour < 12
            ? `${hour} AM`
            : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;
const HourMarker: React.FC<HourMarkerProps> = ({ hour }) => (
    <div
        className="absolute w-full border-t border-gray-200 dark:border-gray-700"
        style={{ top: `${hour * 60}px` }}
    >
        <span className="absolute -top-3 -left-16 text-sm text-gray-500 dark:text-gray-400">
            {formatHour(hour)}
        </span>
    </div>
);