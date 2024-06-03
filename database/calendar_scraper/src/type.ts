export interface CalendarEvent {
  id: number;
  sport: string;
  date: string;
  time: string | null;
  isForMedal: boolean;
  type: string | null;
  location: string | null;
}

export interface TeamEvent extends CalendarEvent {
  teams: string[];
}
