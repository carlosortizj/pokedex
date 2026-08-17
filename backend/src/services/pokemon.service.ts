import { PokemonRepository } from "../repositories/pokemon.repository.js";
import { CacheService } from "./cache.service.js";
import { buildPokemonListCacheKey, buildPokemonCacheKey } from "../utils/pokemon-cache-key.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../errors/app-error.js";

interface PokemonResponse {
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
  navigation: {
    previous: PokemonNavigation | null;
    next: PokemonNavigation | null;
  };
}

interface PokemonNavigation {
  id: number;
  name: string;
  imageUrl: string | null;
}

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

interface PokemonRepositoryPort {
  findMany(
    params: FindPokemonParams,
  ): ReturnType<PokemonRepository["findMany"]>;

  findByExternalId(
    id: number,
  ): ReturnType<PokemonRepository["findByExternalId"]>;

  findPrevious(
    externalId: number,
  ): ReturnType<PokemonRepository["findPrevious"]>;

  findNext(
    externalId: number,
  ): ReturnType<PokemonRepository["findNext"]>;
}

interface CacheServicePort {
  get<T>(key: string): Promise<T | null>;
  set<T>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<void>;
}

export class PokemonService {
  constructor(
    private readonly pokemonRepository: PokemonRepositoryPort =
      new PokemonRepository(),
    private readonly cacheService: CacheServicePort =
      new CacheService(),
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

  async findById(id: number): Promise<PokemonResponse> {
    const cacheKey = buildPokemonCacheKey(id);

    const cached =
      await this.cacheService.get<PokemonResponse>(cacheKey);

    if (cached) {
      logger.info(
        {
          cacheKey,
          pokemonId: id,
        },
        "Pokemon cache hit",
      );

      return cached;
    }

    logger.info(
      {
        cacheKey,
        pokemonId: id,
      },
      "Pokemon cache miss",
    );

    const pokemon =
      await this.pokemonRepository.findByExternalId(id);

    if (!pokemon) {
      throw new AppError(
        "POKEMON_NOT_FOUND",
        404,
        "Pokemon not found.",
      );
    }

    const [previous, next] = await Promise.all([
      this.pokemonRepository.findPrevious(
        pokemon.externalId,
      ),
      this.pokemonRepository.findNext(
        pokemon.externalId,
      ),
    ]);

    const result: PokemonResponse = {
      id: pokemon.externalId,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.baseExperience,
      imageUrl: pokemon.imageUrl,
      types: pokemon.types.map(
        (item) => item.type.name,
      ),
      abilities: pokemon.abilities.map((item) => ({
        name: item.ability.name,
        isHidden: item.isHidden,
      })),

      navigation: {
        previous: previous
          ? {
              id: previous.externalId,
              name: previous.name,
              imageUrl: previous.imageUrl,
            }
          : null,

        next: next
          ? {
              id: next.externalId,
              name: next.name,
              imageUrl: next.imageUrl,
            }
          : null,
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