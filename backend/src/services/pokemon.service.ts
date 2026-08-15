import { PokemonRepository } from "../repositories/pokemon.repository.js";
import { CacheService } from "./cache.service.js";
import { buildPokemonListCacheKey } from "../utils/pokemon-cache-key.js";
import { logger } from "../utils/logger.js";

interface FindPokemonParams {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  sort: "name" | "externalId";
  order: "asc" | "desc";
}

interface PokemonListResponse {
  data: Array<{
    id: number;
    name: string;
    height: number | null;
    weight: number | null;
    baseExperience: number | null;
    imageUrl: string | null;
    types: string[];
    abilities: Array<{
      name: string;
      isHidden: boolean;
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PokemonService {
  constructor(
    private readonly pokemonRepository = new PokemonRepository(),
    private readonly cacheService = new CacheService(),
  ) {}

  async findMany(
    params: FindPokemonParams,
  ): Promise<PokemonListResponse> {
    const cacheKey = buildPokemonListCacheKey(params);

    const cached =
      await this.cacheService.get<PokemonListResponse>(cacheKey);

    if (cached) {
    logger.info(
        {
        cacheKey,
        },
        "Pokemon list cache hit",
    );

    return cached;
    }

    logger.info(
    {
        cacheKey,
    },
    "Pokemon list cache miss",
    );

    const { pokemon, total } =
      await this.pokemonRepository.findMany(params);

    const totalPages = Math.ceil(total / params.limit);

    const result: PokemonListResponse = {
      data: pokemon.map((item) => ({
        id: item.externalId,
        name: item.name,
        height: item.height,
        weight: item.weight,
        baseExperience: item.baseExperience,
        imageUrl: item.imageUrl,
        types: item.types.map((item) => item.type.name),
        abilities: item.abilities.map((item) => ({
          name: item.ability.name,
          isHidden: item.isHidden,
        })),
      })),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    };

    await this.cacheService.set(
      cacheKey,
      result,
      60 * 5,
    );

    return result;
  }
}