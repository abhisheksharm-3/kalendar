import { getAIInsights } from "@/lib/ai-services";
import { Event } from "@/lib/types";
import React from "react";

interface InsightsPanelProps {
    events: Event[];
  }
const InsightsPanel: React.FC<InsightsPanelProps> = ({ events }) => {
    const [insights, setInsights] = React.useState<string[]>([]);
  
    React.useEffect(() => {
      const getInsights = async () => {
        // Call to Gemini API to get insights based on events
        const newInsights = await getAIInsights(events);
        setInsights(newInsights);
      };
      getInsights();
    }, [events]);
  
    return (
      <div className="w-64 bg-gray-200 dark:bg-gray-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">AI Insights</h2>
        {insights.map((insight, index) => (
          <p key={index} className="mb-2">{insight}</p>
        ))}
      </div>
    );
  };

  export default InsightsPanel