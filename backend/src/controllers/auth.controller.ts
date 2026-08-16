import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export class AuthController {
  constructor(
    private readonly authService = new AuthService(),
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const input = registerSchema.parse(req.body);

      const user = await this.authService.register(input);

      res.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const input = loginSchema.parse(req.body);

      const result = await this.authService.login(input);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authenticatedRequest =
        req as AuthenticatedRequest;

      res.status(200).json({
        data: {
          user: {
            id: authenticatedRequest.user.userId,
            email: authenticatedRequest.user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
}