import { Calendar } from "./ui/calendar";
interface MobileCalendarModalProps {
    show: boolean;
    onClose: () => void;
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
  }

const MobileCalendarModal: React.FC<MobileCalendarModalProps> = ({ show, onClose, date, setDate }) => {
    if (!show) return null;

    return (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate: Date | undefined) => {
                        if (newDate) {
                            setDate(newDate);
                            onClose();
                        }
                    }}
                    className="rounded-md border"
                />
                <button
                    onClick={onClose}
                    className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MobileCalendarModal;