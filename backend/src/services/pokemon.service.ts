import { PokemonRepository } from "../repositories/pokemon.repository.js";

interface FindPokemonParams {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  sort: "name" | "externalId";
  order: "asc" | "desc";
}

export class PokemonService {
  constructor(
    private readonly pokemonRepository = new PokemonRepository(),
  ) {}

  async findMany(params: FindPokemonParams) {
    const { pokemon, total } =
      await this.pokemonRepository.findMany(params);

    const totalPages = Math.ceil(total / params.limit);

    return {
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
  }
}