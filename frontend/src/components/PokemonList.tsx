import { useEffect, useState } from "react";
import { getPokemon } from "../services/pokemon.service";
import type { Pokemon } from "../types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { Pagination } from "./Pagination";

interface PokemonListProps {
  search: string;
  type: string;
  page: number;
  onPageChange: (page: number) => void;
}

export function PokemonList({ search, type, page, onPageChange }: PokemonListProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPokemon({
          page,
          limit: 10,
          search: search || undefined,
          type: type || undefined,
        });

        setPokemon(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch {
        setError(
          "No fue posible cargar los Pokémon.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [search, type, page]);

  if (loading) {
    return <p>Cargando Pokémon...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  <>
    <section className="pokemon-grid">
      {pokemon.map((item) => (
        <PokemonCard
          key={item.id}
          pokemon={item}
        />
      ))}
    </section>

    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </>
  );
}