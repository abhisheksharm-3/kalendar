import { Button } from "./ui/button";

interface AISchedulerProps {
    onSchedule: () => Promise<void>;
    aiMode: boolean;
    setAiMode: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AIScheduler: React.FC<AISchedulerProps> = ({ onSchedule, aiMode, setAiMode }) => {
    return (
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onSchedule} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          AI Schedule
        </Button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={aiMode}
            onChange={(e) => setAiMode(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>AI Mode</span>
        </label>
      </div>
    );
  };