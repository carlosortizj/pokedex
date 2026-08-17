import type { Pokemon } from "../types/pokemon";

const API_URL = "http://localhost:3000/api";

export async function getPokemonById(
  id: number,
): Promise<Pokemon> {
  const response = await fetch(
    `${API_URL}/pokemon/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokémon: ${response.status}`,
    );
  }

  const body = await response.json();
  return body.data;
}