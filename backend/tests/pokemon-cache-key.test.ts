import { describe, expect, it } from "vitest";
import { buildPokemonListCacheKey } from "../src/utils/pokemon-cache-key";

describe("buildPokemonListCacheKey", () => {
  it("generates different cache keys for different pages", () => {
    const firstPage = buildPokemonListCacheKey({
      page: 1,
      limit: 20,
      search: "",
      type: "",
      sort: "name",
      order: "asc",
    });

    const secondPage = buildPokemonListCacheKey({
      page: 2,
      limit: 20,
      search: "",
      type: "",
      sort: "name",
      order: "asc",
    });

    expect(firstPage).not.toBe(secondPage);
  });

  it("generates different cache keys for different filters", () => {
    const allPokemon = buildPokemonListCacheKey({
      page: 1,
      limit: 20,
      search: "",
      type: "",
      sort: "name",
      order: "asc",
    });

    const firePokemon = buildPokemonListCacheKey({
      page: 1,
      limit: 20,
      search: "",
      type: "fire",
      sort: "name",
      order: "asc",
    });

    expect(allPokemon).not.toBe(firePokemon);
  });
});