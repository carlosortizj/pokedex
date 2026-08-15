import { env } from "../config/env.js";

export interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    is_hidden: boolean;
    ability: {
      name: string;
    };
  }>;
}

export class PokeApiService {
  async getPokemon(id: number): Promise<PokeApiPokemon> {
    const response = await fetch(`${env.POKEAPI_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(
        `PokéAPI request failed with status ${response.status}`,
      );
    }

    return response.json() as Promise<PokeApiPokemon>;
  }
}