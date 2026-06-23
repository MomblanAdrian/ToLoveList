import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  Recommendation,
  GenerateRecommendationRequest,
} from '@tolovelist/shared';

export const recommendationService = {
  async getByProfile(profileId: string, categorySlug?: string): Promise<Recommendation[]> {
    const path = categorySlug
      ? `${API_ENDPOINTS.RECOMMENDATIONS}/profile/${profileId}/${categorySlug}`
      : `${API_ENDPOINTS.RECOMMENDATIONS}/profile/${profileId}`;
    return apiRequest<Recommendation[]>(path);
  },

  async getByGroup(groupId: string, categorySlug?: string): Promise<Recommendation[]> {
    const path = categorySlug
      ? `${API_ENDPOINTS.RECOMMENDATIONS}/group/${groupId}/${categorySlug}`
      : `${API_ENDPOINTS.RECOMMENDATIONS}/group/${groupId}`;
    return apiRequest<Recommendation[]>(path);
  },

  async generate(data: GenerateRecommendationRequest): Promise<Recommendation[]> {
    return apiRequest<Recommendation[]>(`${API_ENDPOINTS.RECOMMENDATIONS}/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
