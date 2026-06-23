import { prisma } from '../config/database.js';

export const questionRepository = {
  async findByCategory(categoryId: string) {
    return prisma.question.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.question.findUnique({ where: { id } });
  },

  async getProgress(profileId: string, categoryId: string) {
    const totalQuestions = await prisma.question.count({ where: { categoryId } });
    const answeredQuestions = await prisma.answer.count({
      where: {
        profileId,
        question: { categoryId },
      },
    });
    return { totalQuestions, answeredQuestions, isComplete: totalQuestions === answeredQuestions };
  },

  async upsertAnswer(profileId: string, questionId: string, value: number) {
    return prisma.answer.upsert({
      where: { profileId_questionId: { profileId, questionId } },
      update: { value },
      create: { profileId, questionId, value },
    });
  },

  async getAnswersByProfile(profileId: string) {
    return prisma.answer.findMany({
      where: { profileId },
      include: { question: true },
    });
  },

  async getAnswersByProfileAndCategory(profileId: string, categoryId: string) {
    return prisma.answer.findMany({
      where: {
        profileId,
        question: { categoryId },
      },
      include: { question: true },
    });
  },
};
