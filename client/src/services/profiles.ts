import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Profile, CreateProfileRequest } from '@tolovelist/shared';

export const profileService = {
  async list(): Promise<Profile[]> {
    return apiRequest<Profile[]>(API_ENDPOINTS.PROFILES);
  },

  async getById(id: string): Promise<Profile> {
    return apiRequest<Profile>(`${API_ENDPOINTS.PROFILES}/${id}`);
  },

  async create(data: CreateProfileRequest): Promise<Profile> {
    return apiRequest<Profile>(API_ENDPOINTS.PROFILES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CreateProfileRequest>): Promise<Profile> {
    return apiRequest<Profile>(`${API_ENDPOINTS.PROFILES}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.PROFILES}/${id}`, {
      method: 'DELETE',
    });
  },
};
