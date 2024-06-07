export interface Event {
  id: number;
  event_id_for_date: number;
  sport: string;
  type: string;
  teams: string[] | null;
  location: string;
  code_site: string;
  code_sport: string;
  for_medal: boolean;
  medal_type: null | string;
  time: string;
  date: string;
  timestamp: string;
}

export type EventForCalendar = {
  id?: string;
  groupId?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date | null;
  startStr?: string;
  endStr?: string;
  title?: string;
  url?: string;
  classNames?: string[];
  editable?: boolean | null;
  startEditable?: boolean | null;
  durationEditable?: boolean | null;
  resourceEditable?: boolean | null;
  display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
  overlap?: boolean | null;
  //constraint?: any; // A préciser en fonction de la structure de la contrainte
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extendedProps?: Record<string, any>; // A préciser en fonction des propriétés étendues
  //source?: any; // A préciser en fonction de la structure de la source
};
