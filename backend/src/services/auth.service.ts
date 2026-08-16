import { UserRepository } from "../repositories/user.repository.js";
import { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../errors/app-error.js";
import { comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { LoginInput } from "../schemas/auth.schema.js";

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository(),
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
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}

