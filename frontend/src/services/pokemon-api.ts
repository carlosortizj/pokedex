import type { Pokemon } from "../types/pokemon";
import { apiFetch } from "./api-client";

export async function getPokemonById(
  id: number,
): Promise<Pokemon> {
  const response = await apiFetch(
    `/pokemon/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokémon: ${response.status}`,
    );
  }

  const body = await response.json();
  return body.data;
}