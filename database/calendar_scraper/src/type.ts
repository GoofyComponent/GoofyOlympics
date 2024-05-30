export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string | null;
  isForMedal: boolean;
  name: string | null;
  location: string | null;
}

export interface TeamEvent extends CalendarEvent {
  teams: string[];
}
