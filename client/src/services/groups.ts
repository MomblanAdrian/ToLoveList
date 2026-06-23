import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Group, CreateGroupRequest } from '@tolovelist/shared';

export const groupService = {
  async list(): Promise<Group[]> {
    return apiRequest<Group[]>(API_ENDPOINTS.GROUPS);
  },

  async getById(id: string): Promise<Group> {
    return apiRequest<Group>(`${API_ENDPOINTS.GROUPS}/${id}`);
  },

  async create(data: CreateGroupRequest): Promise<Group> {
    return apiRequest<Group>(API_ENDPOINTS.GROUPS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async addProfile(groupId: string, profileId: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.GROUPS}/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });
  },

  async removeProfile(groupId: string, profileId: string): Promise<void> {
    return apiRequest<void>(`${API_ENDPOINTS.GROUPS}/${groupId}/members/${profileId}`, {
      method: 'DELETE',
    });
  },
};
