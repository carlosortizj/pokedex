import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { redis } from "./config/redis.js";

async function startServer() {
  try {
    await redis.connect();

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
        },
        "API server started",
      );
    });

    const shutdown = async () => {
      logger.info("Shutting down server");

      server.close(async () => {
        await redis.quit();

        logger.info("Server shutdown completed");

        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Failed to start server",
    );

    process.exit(1);
  }
}

startServer();