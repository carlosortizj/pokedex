import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  POKEAPI_URL: z.string().url().default("https://pokeapi.co/api/v2"),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(process.env);