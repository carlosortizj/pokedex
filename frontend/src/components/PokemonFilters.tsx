interface PokemonFiltersProps {
  type: string;
  onTypeChange: (type: string) => void;
}

const pokemonTypes = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export function PokemonFilters({
  type,
  onTypeChange,
}: PokemonFiltersProps) {
  return (
    <div className="pokemon-filters">
      <label htmlFor="pokemon-type">
        Tipo
      </label>

      <select
        id="pokemon-type"
        value={type || "all"}
        onChange={(event) => {
          const selectedType = event.target.value;

          onTypeChange(
            selectedType === "all"
              ? ""
              : selectedType,
          );
        }}
      >
        {pokemonTypes.map((pokemonType) => (
          <option
            key={pokemonType}
            value={pokemonType}
          >
            {pokemonType === "all"
              ? "Todos los tipos"
              : pokemonType.charAt(0).toUpperCase() +
                pokemonType.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}