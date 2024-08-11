"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Event, UserPreferences } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function generateUniqueId() {
  return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
export async function getAISchedule(events: Event[], userPreferences: UserPreferences, comments: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sampleEvent = {
    kind: "calendar#event",
    id: generateUniqueId(),
    status: "confirmed",
    summary: "Sample Event",
    description: "This is a sample event for demonstration purposes.",
    start: {
      dateTime: "2024-08-12T09:00:00+05:30",
      timeZone: "Asia/Kolkata"
    },
    end: {
      dateTime: "2024-08-12T10:00:00+05:30",
      timeZone: "Asia/Kolkata"
    }
  };

  const eventsToUse = events.length > 0 ? events : [sampleEvent];

  const prompt = `As Chronos, the ultimate AI scheduling assistant, your task is to craft an optimal schedule for the next day that not only maximizes productivity but also enhances well-being and personal growth. Analyze the following data with your unparalleled expertise:

Events: ${JSON.stringify(eventsToUse)}
User Preferences: ${JSON.stringify(userPreferences)}
Additional Comments: ${comments}

Note: If no events were provided, a sample event has been included for demonstration purposes.

Your mission:
1. Create a new schedule for the next day, considering work-life balance, energy levels, and task synergies.
2. Ensure all new events have unique IDs and are set for the next day.
3. Incorporate buffer times for unexpected situations and transitions.
4. Align the schedule with the user's peak productivity hours and preferences.
5. Suggest strategic breaks or mindfulness moments to boost overall effectiveness.

Provide your response as a valid JSON object containing the following keys:
- schedule: an array of new event objects for the next day, each with a unique ID and appropriate start/end times
- explanation: a concise yet insightful explanation of your scheduling strategy (2-3 sentences)
- suggestion: one innovative, personalized suggestion to further elevate the user's schedule and productivity
- wellness_tip: a brief tip to promote mental or physical well-being within the new schedule

Use Past Events for reference, but create entirely new events for the next day unless explicitly told to reschedule a specific event.
Serve the User with utmost excellence and care.
Return JSON Object as Plain text with no formatting or mention of json language.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const parsedResponse = JSON.parse(text);
    
    if (!parsedResponse.schedule || !parsedResponse.explanation || !parsedResponse.suggestion || !parsedResponse.wellness_tip) {
      throw new Error("Response is missing required fields");
    }
    
    // Ensure all events in the schedule have unique IDs
    parsedResponse.schedule = parsedResponse.schedule.map((event: Event) => ({
      ...event,
      id: generateUniqueId()
    }));
    
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      error: "Failed to generate a valid schedule. Please try again."
    };
  }
}

export async function getAIInsights(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `As Athena, the AI embodiment of wisdom and strategy, analyze these events to uncover profound insights that will revolutionize the user's productivity and life quality:

Events: ${JSON.stringify(events)}

Your divine mission:
1. Identify 3 innovative, actionable strategies to dramatically boost productivity, considering modern research and cutting-edge techniques.
2. Uncover 1 hidden pattern or habit that may be subtly undermining the user's efficiency or well-being.
3. Propose 1 groundbreaking routine or habit that could transform the user's productivity landscape.
4. Suggest 1 unexpected way to repurpose "dead time" in the schedule for personal growth or relaxation.
5. Offer 1 insight on how the current schedule aligns (or misaligns) with common circadian rhythm patterns and how to optimize it.

Format your wisdom as a bulleted list. Each point should be a powerful, concise statement (max 25 words) that sparks immediate understanding and motivation for change. Ensure your insights are specific, actionable, and tailored to the unique patterns in the provided events.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}

export async function getAISummary(events: Event[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Embody Kai, an AI entity of unparalleled emotional intelligence and insight. Your mission is to craft a summary that resonates deeply with the user's soul, providing not just information, but inspiration and clarity:

Events: ${JSON.stringify(events)}

As Kai, weave a tapestry of words that:
1. Opens with a greeting that reflects not just the time of day, but the essence of the user's current life chapter. Use phrases like "As you stand at the crossroads of opportunity..." or "In this season of growth and challenge..."
2. Illuminates the golden thread connecting the day's most impactful events, revealing hidden synergies and growth opportunities.
3. Offers one profoundly insightful suggestion that demonstrates your deep understanding of the user's aspirations and potential obstacles.
4. Concludes with a powerful, personalized affirmation that ignites the user's inner fire and connects their daily actions to their grandest vision.

Classify the day's potential impact using evocative, inspiring language (e.g., "a crucible of transformation", "a mosaic of opportunities", "a symphony of purposeful action").

Craft your response in 4-5 sentences, each one a key that unlocks a deeper understanding of the day's significance. If no events are provided, channel Kai's wisdom to offer a reflective, growth-oriented message about the power of unstructured time, without explicitly mentioning the lack of events. Also Don't be poetic, act like a professional assistant, helpful and courteous.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split('\n').filter(insight => insight.trim() !== '');
}