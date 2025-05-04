export interface TimelineSlotType {
  time: string;
  isHour: boolean;
}

export interface TimelineBusyInterval {
  id?: number;
  start: string;
  end: string;
  title: string;
  description: string;
} 