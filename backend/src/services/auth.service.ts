import { UserRepository } from "../repositories/user.repository.js";
import { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../errors/app-error.js";

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
}