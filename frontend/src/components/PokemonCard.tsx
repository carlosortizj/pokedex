import { Link } from "react-router-dom";
import type { Pokemon } from "../types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({
  pokemon,
}: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card"
    >
      <div className="pokemon-card-image">
        {pokemon.imageUrl ? (
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            loading="lazy"
          />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className="pokemon-card-content">
        <span className="pokemon-card-id">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        <h2>{pokemon.name}</h2>

        <div className="pokemon-types">
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
    </Link>
  );
}