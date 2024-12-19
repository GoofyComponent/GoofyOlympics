import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  confirmPassword?: string;
  region?: string;
}

export class AuthApi extends BaseApi {
  async login(data: LoginData): Promise<never> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
  }

  async register(data: RegisterData): Promise<never> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }
}

export const authApi = new AuthApi();
