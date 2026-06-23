import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const recommendationRepository = {
  async findByProfileId(profileId: string, categorySlug?: string) {
    const where: Record<string, unknown> = { profileId, status: 'active' };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    return prisma.recommendation.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async findByGroupId(groupId: string, categorySlug?: string) {
    const where: Record<string, unknown> = { groupId, status: 'active' };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    return prisma.recommendation.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async findByProfileIdWithStatus(profileId: string, categorySlug: string, status: string) {
    return prisma.recommendation.findMany({
      where: { profileId, status, category: { slug: categorySlug } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.recommendation.update({
      where: { id },
      data: { status },
    });
  },

  async deleteByProfileAndCategory(profileId: string, categoryId: string) {
    return prisma.recommendation.deleteMany({
      where: { profileId, categoryId },
    });
  },

  async create(data: {
    categoryId: string;
    profileId: string;
    groupId?: string;
    title: string;
    description: string;
    whyMatch: string;
    compatibilityScore: number;
    metadata: Prisma.JsonValue;
    source: string;
  }) {
    return prisma.recommendation.create({
      data: data as unknown as Prisma.RecommendationCreateInput,
      include: { category: true },
    });
  },

  async createMany(data: Array<{
    categoryId: string;
    profileId: string;
    groupId?: string;
    title: string;
    description: string;
    whyMatch: string;
    compatibilityScore: number;
    metadata: Prisma.JsonValue;
    source: string;
  }>) {
    return prisma.recommendation.createMany({
      data: data as unknown as Prisma.RecommendationCreateManyInput[],
    });
  },
};
