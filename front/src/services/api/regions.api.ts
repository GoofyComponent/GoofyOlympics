import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface RegionFilters {
  page?: number;
  limit?: number;
  noc?: string;
  region?: string;
  notes?: string;
}

export class RegionsApi extends BaseApi {
  async getRegions(filters: RegionFilters = {}): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.REGIONS.BASE, { params: filters });
  }
}

export const regionsApi = new RegionsApi();
