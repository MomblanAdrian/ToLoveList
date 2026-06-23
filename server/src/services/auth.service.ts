import { v4 as uuid } from 'uuid';
import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/api-error.js';
import { ERROR_CODES } from '@tolovelist/shared';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import type { AuthResponse } from '@tolovelist/shared';
import type { User } from '@prisma/client';

function toUserResponse(user: User) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(data: { email: string; username: string; password: string }): Promise<AuthResponse> {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw ApiError.conflict(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw ApiError.conflict(ERROR_CODES.USERNAME_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    const tokens = await generateTokens(user);
    return { user: toUserResponse(user), tokens };
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = await generateTokens(user);
    return { user: toUserResponse(user), tokens };
  },

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    return generateTokens(user);
  },

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  },
};
