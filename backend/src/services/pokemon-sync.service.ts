import { PokeApiService } from "./pokeapi.service.js";
import { PokemonRepository } from "../repositories/pokemon.repository.js";
import { CacheService } from "./cache.service.js";
import { buildPokemonCacheKey, POKEMON_LIST_CACHE_PATTERN } from "../utils/pokemon-cache-key.js";

export class PokemonSyncService {
  constructor(
    private readonly pokeApiService = new PokeApiService(),
    private readonly pokemonRepository = new PokemonRepository(),
    private readonly cacheService = new CacheService(),
  ) {}

  async syncPokemon(id: number) {
    const pokemon = await this.pokeApiService.getPokemon(id);

    const savedPokemon =
      await this.pokemonRepository.upsertPokemon({
        externalId: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        baseExperience: pokemon.base_experience,
        imageUrl: pokemon.sprites.front_default,
      });

    for (const typeData of pokemon.types) {
      const type = await this.pokemonRepository.upsertType(
        typeData.type.name,
      );

      await this.pokemonRepository.createPokemonType(
        savedPokemon.id,
        type.id,
      );
    }

    for (const abilityData of pokemon.abilities) {
      const ability =
        await this.pokemonRepository.upsertAbility(
          abilityData.ability.name,
        );

      await this.pokemonRepository.createPokemonAbility(
        savedPokemon.id,
        ability.id,
        abilityData.is_hidden,
      );
    }

    await this.cacheService.deleteByPattern(
        POKEMON_LIST_CACHE_PATTERN,
    );

    await this.cacheService.deleteByPattern(
      POKEMON_LIST_CACHE_PATTERN,
    );

    await this.cacheService.delete(
      buildPokemonCacheKey(savedPokemon.externalId),
    );

    return savedPokemon;
  }
}