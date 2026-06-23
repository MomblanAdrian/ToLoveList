import { prisma } from '../config/database.js';
import type { RelationshipType } from '@prisma/client';

export const profileRepository = {
  async findByUserId(userId: string) {
    return prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.profile.findUnique({ where: { id } });
  },

  async create(data: { userId: string; name: string; relationshipType: RelationshipType; avatarUrl?: string }) {
    return prisma.profile.create({ data });
  },

  async update(id: string, data: { name?: string; avatarUrl?: string }) {
    return prisma.profile.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.profile.delete({ where: { id } });
  },
};
