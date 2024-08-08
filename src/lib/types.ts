export interface Event {
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
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurringEventId?: string;
  originalStartTime?: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
  eventType: string;
  guestsCanModify?: boolean;
}
  
  export interface UserPreferences {
    workStartTime: string;
    workEndTime: string;
    preferredMeetingDuration: number;
    focusTimeBlocks: number;
    lunchTime: string;
    breakFrequency: number;
  }
  
  export interface UserHistory {
    completedTasks: {
      date: string;
      taskName: string;
      duration: number;
    }[];
    productiveHours: {
      day: string;
      hours: number[];
    }[];
    commonDelays: string[];
  }

export  interface Schedule {
    schedule: Event[];
  }