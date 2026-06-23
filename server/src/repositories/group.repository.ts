import { prisma } from '../config/database.js';

export const groupRepository = {
  async findByOwnerId(ownerId: string) {
    return prisma.group.findMany({
      where: { ownerId },
      include: {
        profiles: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.group.findUnique({
      where: { id },
      include: {
        profiles: {
          include: { profile: true },
        },
      },
    });
  },

  async create(data: { name: string; ownerId: string; profileIds: string[] }) {
    return prisma.group.create({
      data: {
        name: data.name,
        ownerId: data.ownerId,
        profiles: {
          create: data.profileIds.map((profileId) => ({ profileId })),
        },
      },
      include: {
        profiles: {
          include: { profile: true },
        },
      },
    });
  },

  async addProfile(groupId: string, profileId: string) {
    return prisma.groupProfile.create({
      data: { groupId, profileId },
      include: { profile: true },
    });
  },

  async removeProfile(groupId: string, profileId: string) {
    return prisma.groupProfile.delete({
      where: { groupId_profileId: { groupId, profileId } },
    });
  },

  async getProfileCount(groupId: string): Promise<number> {
    return prisma.groupProfile.count({ where: { groupId } });
  },
};
