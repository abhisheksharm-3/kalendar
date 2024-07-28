export interface Event {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    day: number;
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