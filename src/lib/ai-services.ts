'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { EventType, UserPreferencesType, ScheduleResponseType } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a unique ID for new events.
 */
function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generates an AI-optimized schedule based on existing events and user preferences.
 */
export async function getAISchedule(
  events: EventType[],
  userPreferences: UserPreferencesType,
  comments: string
): Promise<ScheduleResponseType | { error: string }> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const sampleEvent = {
    kind: 'calendar#event',
    id: generateEventId(),
    status: 'confirmed',
    summary: 'Sample Event',
    description: 'This is a sample event for demonstration purposes.',
    start: {
      dateTime: new Date().toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(Date.now() + 3600000).toISOString(),
      timeZone: 'Asia/Kolkata',
    },
  };

  const eventsToUse = events.length > 0 ? events : [sampleEvent];

  const prompt = `As Chronos, the ultimate AI scheduling assistant, create an optimal schedule for the next day.

Events: ${JSON.stringify(eventsToUse)}
User Preferences: ${JSON.stringify(userPreferences)}
Additional Comments: ${comments}

Requirements:
1. Create a new schedule for the next day with work-life balance and energy levels in mind.
2. Ensure all new events have unique IDs and are set for the next day.
3. Include buffer times for transitions.
4. Align with the user's peak productivity hours.
5. Include strategic breaks for effectiveness.

Respond with a valid JSON object containing:
- schedule: array of event objects for the next day with unique IDs
- explanation: concise explanation of your scheduling strategy (2-3 sentences)
- suggestion: one personalized suggestion to improve productivity
- wellness_tip: a brief tip for mental or physical well-being

Return JSON as plain text without formatting or code blocks.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const parsedResponse = JSON.parse(text) as ScheduleResponseType;

    if (
      !parsedResponse.schedule ||
      !parsedResponse.explanation ||
      !parsedResponse.suggestion ||
      !parsedResponse.wellness_tip
    ) {
      throw new Error('Response is missing required fields');
    }

    parsedResponse.schedule = parsedResponse.schedule.map((event) => ({
      ...event,
      id: generateEventId(),
    }));

    return parsedResponse;
  } catch {
    return { error: 'Failed to generate a valid schedule. Please try again.' };
  }
}

/**
 * Generates AI insights based on user's events.
 */
export async function getAIInsights(events: EventType[]): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `Analyze these calendar events and provide actionable insights:

Events: ${JSON.stringify(events)}

Provide:
1. 3 strategies to boost productivity
2. 1 hidden pattern that may be undermining efficiency
3. 1 new habit recommendation
4. 1 way to use "dead time" productively
5. 1 insight on circadian rhythm alignment

Format as a bulleted list with concise points (max 25 words each).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text.split('\n').filter((insight) => insight.trim() !== '');
}

/**
 * Generates an AI summary for the day's events.
 */
export async function getAISummary(events: EventType[]): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `As Kai, a professional AI assistant, provide a helpful summary:

Events: ${JSON.stringify(events)}

Create a summary that:
1. Opens with a time-appropriate greeting
2. Highlights connections between the day's events
3. Offers one insightful suggestion
4. Concludes with a motivating statement

Keep it professional and helpful. 4-5 sentences total.
If no events are provided, offer a reflective message about using free time productively.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text.split('\n').filter((insight) => insight.trim() !== '');
}