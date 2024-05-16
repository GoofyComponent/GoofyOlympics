import { Competition } from './competition';

export interface Athlete {
  id: number;
  name: string;
  username: string;
  email: string;
  adress: [string, string];
  sport: string;
  photo: string;
  currentRank: number;
  bestTime: string;
  goldMedals: number;
  competitions: Competition[];
}
