import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Question, Answer, QuestionnaireProgress, CategoryWithProgress } from '@tolovelist/shared';

export const questionService = {
  async getByCategory(categorySlug: string): Promise<Question[]> {
    return apiRequest<Question[]>(`${API_ENDPOINTS.QUESTIONS}/categories/${categorySlug}`);
  },

  async getProgress(profileId: string, categorySlug: string): Promise<QuestionnaireProgress> {
    return apiRequest<QuestionnaireProgress>(
      `${API_ENDPOINTS.QUESTIONS}/progress/${profileId}/${categorySlug}`,
    );
  },

  async getAllProgress(profileId: string): Promise<CategoryWithProgress[]> {
    return apiRequest<CategoryWithProgress[]>(
      `${API_ENDPOINTS.QUESTIONS}/progress/${profileId}`,
    );
  },

  async submitAnswer(profileId: string, questionId: string, value: number): Promise<Answer> {
    return apiRequest<Answer>(`${API_ENDPOINTS.QUESTIONS}/answers/${profileId}`, {
      method: 'POST',
      body: JSON.stringify({ questionId, value }),
    });
  },

  async getAnswers(profileId: string, categorySlug?: string): Promise<Answer[]> {
    const params = categorySlug ? `?categorySlug=${categorySlug}` : '';
    return apiRequest<Answer[]>(`${API_ENDPOINTS.QUESTIONS}/answers/${profileId}${params}`);
  },
};
