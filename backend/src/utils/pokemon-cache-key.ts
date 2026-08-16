import type { PokemonQuery } from "../schemas/pokemon.schema.js";

export const POKEMON_LIST_CACHE_PATTERN = "pokemon:list:*";

export function buildPokemonListCacheKey(
  query: PokemonQuery,
): string {
  return [
    "pokemon:list",
    `page=${query.page}`,
    `limit=${query.limit}`,
    `search=${query.search ?? ""}`,
    `type=${query.type ?? ""}`,
    `sort=${query.sort}`,
    `order=${query.order}`,
  ].join(":");
}