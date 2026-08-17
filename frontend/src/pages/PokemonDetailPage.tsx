import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPokemonById } from "../services/pokemon-api";
import type { Pokemon } from "../types/pokemon";

export function PokemonDetailPage() {
  const { id } = useParams();

  const pokemonId = Number(id);

  const isValidId =
    Number.isInteger(pokemonId) && pokemonId > 0;

  const [pokemon, setPokemon] =
    useState<Pokemon | null>(null);

  const [loading, setLoading] =
    useState(isValidId);

  const [error, setError] =
    useState<string | null>(
      isValidId ? null : "Pokémon inválido.",
    );

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let cancelled = false;

    async function loadPokemon() {
      try {
        const data =
          await getPokemonById(pokemonId);

        if (!cancelled) {
          setPokemon(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError(
            "No fue posible cargar el Pokémon.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      cancelled = true;
    };
  }, [pokemonId, isValidId]);

  if (loading) {
    return (
      <main className="pokemon-detail-page">
        <div className="pokemon-detail-container">
          <p className="pokemon-detail-status">
            Cargando Pokémon...
          </p>
        </div>
      </main>
    );
  }

  if (error || !pokemon) {
    return (
      <main className="pokemon-detail-page">
        <div className="pokemon-detail-container">
          <p className="pokemon-detail-status">
            {error ?? "Pokémon no encontrado."}
          </p>

          <Link
            to="/"
            className="pokemon-detail-back"
          >
            ← Volver al Pokédex
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pokemon-detail-page">
      <div className="pokemon-detail-container">
        <Link
          to="/"
          className="pokemon-detail-back"
        >
          ← Volver al Pokédex
        </Link>

        <section className="pokemon-detail-header">
          <div>
            <span className="pokemon-detail-id">
              #{String(pokemon.id).padStart(3, "0")}
            </span>

            <h1>{pokemon.name}</h1>

            <div className="pokemon-detail-types">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="pokemon-type"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="pokemon-detail-main">
          <div className="pokemon-detail-image">
            {pokemon.imageUrl ? (
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
              />
            ) : (
              <span>Sin imagen</span>
            )}
          </div>

          <div className="pokemon-detail-info">
            <h2>Información</h2>

            <div className="pokemon-detail-stats">
              <div className="pokemon-detail-stat">
                <span>Altura</span>
                <strong>
                  {pokemon.height !== null
                    ? `${(pokemon.height / 10).toFixed(1)} m`
                    : "N/A"}
                </strong>
              </div>

              <div className="pokemon-detail-stat">
                <span>Peso</span>
                <strong>
                  {pokemon.weight !== null
                    ? `${(pokemon.weight / 10).toFixed(1)} kg`
                    : "N/A"}
                </strong>
              </div>

              <div className="pokemon-detail-stat">
                <span>Experiencia base</span>
                <strong>
                  {pokemon.baseExperience ?? "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="pokemon-detail-abilities">
          <h2>Habilidades</h2>

          <div className="pokemon-abilities-list">
            {pokemon.abilities.map((ability) => (
              <div
                key={ability.name}
                className="pokemon-ability"
              >
                <strong>{ability.name}</strong>

                {ability.isHidden && (
                  <span>
                    Habilidad oculta
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}