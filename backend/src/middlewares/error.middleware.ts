import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(
    {
      error,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled request error",
  );

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
}