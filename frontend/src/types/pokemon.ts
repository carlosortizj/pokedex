export interface Pokemon {
  id: number;
  name: string;
  height: number | null;
  weight: number | null;
  baseExperience: number | null;
  imageUrl: string | null;
  types: string[];
  abilities: PokemonAbility[];
  navigation: {
    previous: PokemonNavigation | null;
    next: PokemonNavigation | null;
  };
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PokemonListResponse {
  data: Pokemon[];
  pagination: PokemonPagination;
}

export interface PokemonNavigation {
  id: number;
  name: string;
  imageUrl: string | null;
}