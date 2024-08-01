import { GoogleGenerativeAI } from "@google/generative-ai";
import { Event, UserPreferences } from "./types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function getAISchedule(events: Event[], userPreferences: UserPreferences) {
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Given the following events and user preferences, suggest an optimized schedule:
    Events: ${JSON.stringify(events)}
    User Preferences: ${JSON.stringify(userPreferences)}
    Please provide the optimized schedule in a JSON format.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return JSON.parse(text);
}

export async function getAIInsights(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Based on the following events, provide insights and tips for improving productivity:
    Events: ${JSON.stringify(events)}
    Please provide 3-5 concise insights or tips.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}
export async function getAISummary(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the following events and provide days summary:
    Events: ${JSON.stringify(events)}
    Please ensure you dont cross 3 lines limit.
    Additionally, classify the day as average, productive, or not productive based on the events.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}