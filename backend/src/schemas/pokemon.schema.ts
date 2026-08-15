import { z } from "zod";

export const pokemonQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().min(1).optional(),

  type: z.string().trim().min(1).optional(),

  sort: z
    .enum(["name", "externalId"])
    .default("externalId"),

  order: z.enum(["asc", "desc"]).default("asc"),
});

export type PokemonQuery = z.infer<typeof pokemonQuerySchema>;