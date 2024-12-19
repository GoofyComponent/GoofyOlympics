import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface AthleteFilters {
  page?: number;
  limit?: number;
  name?: string;
  sex?: string;
  age?: number;
  team?: string;
  noc?: string;
  games?: string;
  year?: number;
  season?: 'Summer' | 'Winter';
  city?: string;
  sport?: string;
  event?: string;
  medal?: 'Gold' | 'Silver' | 'Bronze';
  height?: number;
  weight?: number;
  optionSort?: 'less' | 'more' | 'equal';
}

export class AthletesApi extends BaseApi {
  async getAthletes(filters: AthleteFilters = {}): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.ATHLETES.BASE, { params: filters });
  }

  async getAthleteById(id: number): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.ATHLETES.BY_ID(id));
  }
}

export const athletesApi = new AthletesApi();
