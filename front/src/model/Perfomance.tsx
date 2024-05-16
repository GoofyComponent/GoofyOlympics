export interface PerformanceData {
  entity: string; // Peut être le nom d'un athlète, d'une équipe ou d'un pays
  year: number; // Année de l'édition des jeux
  gold: number;
  silver: number;
  bronze: number;
  totalMedals: number;
}

export interface ComparisonResultProps {
  data: PerformanceData[];
}

export interface ComparisonSelectorProps {
  entities: string[];
  onSelectionChange: (selection: { entity: string; year: number }) => void;
}
