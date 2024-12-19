import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface MedalFilters {
  noc?: string;
}

export class MedalsApi extends BaseApi {
  async getMedals(filters: MedalFilters = {}): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.MEDALS.BASE, { params: filters });
  }
}

export const medalsApi = new MedalsApi();
