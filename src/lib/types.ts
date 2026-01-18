/**
 * Represents a calendar event from Google Calendar API.
 */
export interface EventType {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description?: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: EventDateTimeType;
  end: EventDateTimeType;
  recurringEventId?: string;
  originalStartTime?: EventDateTimeType;
  iCalUID: string;
  sequence: number;
  reminders: EventRemindersType;
  eventType: string;
  guestsCanModify?: boolean;
  recurrence?: string[];
}

/**
 * Represents a date/time with timezone for an event.
 */
export interface EventDateTimeType {
  dateTime: string;
  timeZone: string;
}

/**
 * Represents reminder settings for an event.
 */
export interface EventRemindersType {
  useDefault: boolean;
  overrides?: EventReminderOverrideType[];
}

/**
 * Represents a single reminder override.
 */
export interface EventReminderOverrideType {
  method: string;
  minutes: number;
}

/**
 * User preferences for scheduling.
 */
export interface UserPreferencesType {
  workStartTime: string;
  workEndTime: string;
  preferredMeetingDuration: number;
  focusTimeBlocks: number;
  lunchTime: string;
  breakFrequency: number;
}

/**
 * User history for AI scheduling context.
 */
export interface UserHistoryType {
  completedTasks: CompletedTaskType[];
  productiveHours: ProductiveHourType[];
  commonDelays: string[];
}

/**
 * Represents a completed task in user history.
 */
export interface CompletedTaskType {
  date: string;
  taskName: string;
  duration: number;
}

/**
 * Represents productive hours data for a day.
 */
export interface ProductiveHourType {
  day: string;
  hours: number[];
}

/**
 * Response from AI schedule generation.
 */
export interface ScheduleResponseType {
  schedule: EventType[];
  explanation: string;
  suggestion: string;
  wellness_tip: string;
}

/**
 * Calendar view type options.
 */
export type CalendarViewType = 'day' | 'week' | 'month';

/**
 * Recurrence frequency options.
 */
export type RecurrenceType = 'none' | 'FREQ=DAILY' | 'FREQ=WEEKLY' | 'FREQ=MONTHLY';