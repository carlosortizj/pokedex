import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import type { AccessTokenPayload } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(
      new AppError(
        "UNAUTHORIZED",
        401,
        "Authentication required.",
      ),
    );

    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(
      new AppError(
        "UNAUTHORIZED",
        401,
        "Invalid authorization header.",
      ),
    );

    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;

    (req as AuthenticatedRequest).user = payload;

    next();
  } catch {
    next(
      new AppError(
        "UNAUTHORIZED",
        401,
        "Invalid or expired access token.",
      ),
    );
  }
}