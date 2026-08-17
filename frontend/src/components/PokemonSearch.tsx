import { useEffect, useState } from "react";

interface PokemonSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PokemonSearch({
  value,
  onChange,
}: PokemonSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onChange(inputValue.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [inputValue, onChange]);

  return (
    <div className="pokemon-search">
      <label htmlFor="pokemon-search">
        Buscar Pokémon
      </label>

      <input
        id="pokemon-search"
        type="search"
        value={inputValue}
        onChange={(event) =>
          setInputValue(event.target.value)
        }
        placeholder="Buscar por nombre..."
      />
    </div>
  );
}