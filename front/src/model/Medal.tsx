interface MedalCount {
  country: string;
  gold: number;
  silver: number;
  bronze: number;
}

export interface MedalTableProps {
  medals: MedalCount[];
}

export interface CountryMedalRowProps {
  countryMedals: MedalCount;
}

export type MedalType = 'All' | 'Gold' | 'Silver' | 'Bronze';
