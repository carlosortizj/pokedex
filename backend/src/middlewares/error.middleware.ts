import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
    if (error instanceof ZodError) {
    logger.warn(
        {
        issues: error.issues,
        method: req.method,
        url: req.originalUrl,
        },
        "Validation error",
    );

    res.status(400).json({
        error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data.",
        details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        })),
        },
    });

    return;
    }
  if (error instanceof AppError) {
    logger.warn(
      {
        errorCode: error.code,
        statusCode: error.statusCode,
        method: req.method,
        url: req.originalUrl,
      },
      "Application error",
    );

    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });

    return;
  }

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