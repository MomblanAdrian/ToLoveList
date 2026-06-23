import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const recommendationRepository = {
  async findByProfileId(profileId: string, categorySlug?: string) {
    const where: Record<string, unknown> = { profileId };
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
    const where: Record<string, unknown> = { groupId };
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
