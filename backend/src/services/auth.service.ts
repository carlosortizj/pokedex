import { UserRepository } from "../repositories/user.repository.js";
import { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../errors/app-error.js";
import { comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type RefreshTokenPayload } from "../utils/jwt.js";
import { LoginInput } from "../schemas/auth.schema.js";
import { randomUUID } from "node:crypto";
import { SessionService } from "./session.service.js";
import { durationToSeconds } from "../utils/time.js";
import { env } from "../config/env.js";

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly sessionService = new SessionService(),
  ) {}

  async register(input: RegisterInput) {
    const existingUser =
      await this.userRepository.findByEmail(input.email);

    if (existingUser) {
    throw new AppError(
        "USER_ALREADY_EXISTS",
        409,
        "A user with this email already exists.",
    );
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.userRepository.create(
      input.email,
      passwordHash,
    );

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(
      input.email,
    );
    const sessionId = randomUUID();

    if (!user) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password.",
      );
    }

    const passwordMatches = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password.",
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId,
    });

    const refreshTtl = durationToSeconds(
      env.JWT_REFRESH_EXPIRES_IN,
    );

    await this.sessionService.createSession(
      sessionId,
      user.id,
      refreshTtl,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    let payload: RefreshTokenPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        "INVALID_REFRESH_TOKEN",
        401,
        "Invalid or expired refresh token.",
      );
    }

    const userId = await this.sessionService.getUserId(
      payload.sessionId,
    );

    if (!userId || userId !== payload.userId) {
      throw new AppError(
        "INVALID_REFRESH_TOKEN",
        401,
        "Invalid or expired refresh token.",
      );
    }

    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        "USER_NOT_FOUND",
        404,
        "User not found.",
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string) {
  let payload: RefreshTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  await this.sessionService.deleteSession(
    payload.sessionId,
  );
}
}

