import express from "express";
import cors from "cors";
import { prisma } from "./config/database.js";
import pokemonRoutes from "./routes/pokemon.routes.js";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pokedex-api",
  });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/pokemon", pokemonRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;