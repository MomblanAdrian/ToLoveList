import { profileRepository } from '../repositories/profile.repository.js';
import { ApiError } from '../utils/api-error.js';
import { ERROR_CODES } from '@tolovelist/shared';
import type { RelationshipType } from '@prisma/client';

export const profileService = {
  async getUserProfiles(userId: string) {
    return profileRepository.findByUserId(userId);
  },

  async getProfile(id: string, userId: string) {
    const profile = await profileRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }
    if (profile.userId !== userId) {
      throw ApiError.forbidden();
    }
    return profile;
  },

  async createProfile(userId: string, data: { name: string; relationshipType: RelationshipType; avatarUrl?: string }) {
    return profileRepository.create({
      userId,
      name: data.name,
      relationshipType: data.relationshipType,
      avatarUrl: data.avatarUrl,
    });
  },

  async updateProfile(id: string, userId: string, data: { name?: string; avatarUrl?: string }) {
    const profile = await profileRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }
    if (profile.userId !== userId) {
      throw ApiError.forbidden();
    }
    return profileRepository.update(id, data);
  },

  async deleteProfile(id: string, userId: string) {
    const profile = await profileRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }
    if (profile.userId !== userId) {
      throw ApiError.forbidden();
    }
    return profileRepository.delete(id);
  },
};
