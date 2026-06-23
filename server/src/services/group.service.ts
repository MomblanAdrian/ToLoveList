import { groupRepository } from '../repositories/group.repository.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { ApiError } from '../utils/api-error.js';
import { ERROR_CODES } from '@tolovelist/shared';

export const groupService = {
  async getUserGroups(userId: string) {
    return groupRepository.findByOwnerId(userId);
  },

  async getGroup(id: string, userId: string) {
    const group = await groupRepository.findById(id);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }
    if (group.ownerId !== userId) {
      throw ApiError.forbidden();
    }
    return group;
  },

  async createGroup(userId: string, data: { name: string; profileIds: string[] }) {
    const profiles = await Promise.all(
      data.profileIds.map((id) => profileRepository.findById(id)),
    );

    const notFound = profiles.some((p) => !p);
    if (notFound) {
      throw ApiError.notFound('One or more profiles not found');
    }

    const forbidden = profiles.some((p) => p!.userId !== userId);
    if (forbidden) {
      throw ApiError.forbidden('One or more profiles do not belong to you');
    }

    if (data.profileIds.length > 5) {
      throw ApiError.badRequest(ERROR_CODES.GROUP_FULL, 'Maximum 5 profiles per group');
    }

    return groupRepository.create({
      name: data.name,
      ownerId: userId,
      profileIds: data.profileIds,
    });
  },

  async addProfileToGroup(groupId: string, userId: string, profileId: string) {
    const group = await groupRepository.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }
    if (group.ownerId !== userId) {
      throw ApiError.forbidden();
    }

    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }

    const count = await groupRepository.getProfileCount(groupId);
    if (count >= 5) {
      throw ApiError.badRequest(ERROR_CODES.GROUP_FULL, 'Group already has maximum profiles');
    }

    const alreadyInGroup = group.profiles.some((gp) => gp.profileId === profileId);
    if (alreadyInGroup) {
      throw ApiError.conflict(ERROR_CODES.PROFILE_ALREADY_IN_GROUP);
    }

    return groupRepository.addProfile(groupId, profileId);
  },

  async removeProfileFromGroup(groupId: string, userId: string, profileId: string) {
    const group = await groupRepository.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }
    if (group.ownerId !== userId) {
      throw ApiError.forbidden();
    }

    return groupRepository.removeProfile(groupId, profileId);
  },
};
