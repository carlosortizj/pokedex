import type { Pokemon, PokemonListResponse } from "../types/pokemon";

const API_URL = import.meta.env.VITE_API_URL;

interface PokemonQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  sort?: "name" | "externalId";
  order?: "asc" | "desc";
}

export async function getPokemon(
  params: PokemonQueryParams = {},
): Promise<PokemonListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.order) {
    searchParams.set("order", params.order);
  }

  const response = await fetch(
    `${API_URL}/pokemon?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener los Pokémon.",
    );
  }

  return response.json();
}

export async function getPokemonById(
  id: number,
): Promise<Pokemon> {
  const response = await fetch(
    `${API_URL}/pokemon/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener el Pokémon.",
    );
  }

  const result: { data: Pokemon } =
    await response.json();

  return result.data;
}