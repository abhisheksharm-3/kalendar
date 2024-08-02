"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Event, UserPreferences } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getAISchedule(events: Event[], userPreferences: UserPreferences) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `As an expert AI scheduler, optimize the following events considering the user's preferences:

Events: ${JSON.stringify(events)}
User Preferences: ${JSON.stringify(userPreferences)}

Please provide:
1. An optimized schedule in JSON format
2. A brief explanation of your optimization strategy (max 2 sentences)
3. One suggestion for improving the schedule further

Ensure the JSON schedule maintains the original event structure while adjusting times and order as needed.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return JSON.parse(text);
}

export async function getAIInsights(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `As a productivity expert, analyze these events and provide valuable insights:

Events: ${JSON.stringify(events)}

Please provide:
1. 3 specific, actionable tips to improve productivity based on the event patterns
2. 1 observation about potential time-wasters or areas of inefficiency
3. 1 suggestion for a habit or routine that could enhance overall productivity

Format your response as a bulleted list, with each point being concise (max 20 words) yet impactful.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}

export async function getAISummary(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are Kai, an advanced AI assistant with exceptional emotional intelligence. Analyze today's events and provide a personalized summary:

Events: ${JSON.stringify(events)}

As Kai, create a brief, powerful summary that:
1. Opens with a context-aware greeting (use "Good morning", "Good afternoon", or "Good evening" based on the first event's time, or a neutral greeting if time is unclear)
2. Highlights the day's most impactful events and their potential synergies
3. Offers one unique, insightful suggestion that demonstrates your deep understanding of the user's goals
4. Concludes with an encouraging note tied to the user's personal or professional growth

Classify the day's potential impact (e.g., "pivotal", "growth-oriented", "networking-rich").

Limit your response to 3-4 sentences total. If no events are provided, respond with a casual, friendly message acknowledging the free day and don't say give me events to analyse.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}