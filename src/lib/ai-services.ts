import { GoogleGenerativeAI } from "@google/generative-ai";
import { Event, UserHistory, UserPreferences } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

export async function getAIInsights(events: Event[], userHistory: UserHistory) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on the following events and user history, provide insights and tips for improving productivity:
    Events: ${JSON.stringify(events)}
    User History: ${JSON.stringify(userHistory)}
    Please provide 3-5 concise insights or tips.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}