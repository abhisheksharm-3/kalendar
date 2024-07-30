export interface Event {
  id: number;
  title: string;
  day: number;
  start: number;
  duration: number;
  color: string;
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