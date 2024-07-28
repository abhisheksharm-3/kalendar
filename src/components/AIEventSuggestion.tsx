interface AIEventSuggestionProps {
    suggestion: {
      id: string;
      title: string;
      startTime: string;
      endTime: string;
      day: number;
      style: React.CSSProperties;
    };
    onAccept: () => void;
    onDecline: () => void;
  }
const AIEventSuggestion: React.FC<AIEventSuggestionProps> = ({ suggestion, onAccept, onDecline }) => {
    return (
      <div className="absolute p-2 rounded-md bg-yellow-200 dark:bg-yellow-800" style={suggestion.style}>
        <p>{suggestion.title}</p>
        <div className="flex justify-end space-x-2 mt-2">
          <button onClick={onDecline} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Decline</button>
          <button onClick={onAccept} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Accept</button>
        </div>
      </div>
    );
  };
  export default AIEventSuggestion;