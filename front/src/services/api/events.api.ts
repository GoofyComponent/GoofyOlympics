import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface EventFilters {
  page?: number;
  limit?: number;
  sport?: string;
  type?: string;
  teams?: string;
  location?: string;
  code_site?: string;
  code_sport?: string;
  for_medal?: boolean;
  medal_type?: string;
  time?: string;
  date?: string;
  timestamp?: string;
}

export class EventsApi extends BaseApi {
  async getEvents(filters: EventFilters = {}): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.EVENTS.BASE, { params: filters });
  }
}

export const eventsApi = new EventsApi();
