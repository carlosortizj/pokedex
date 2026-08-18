import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PokemonList } from "../components/PokemonList";
import { PokemonSearch } from "../components/PokemonSearch";
import { PokemonFilters } from "../components/PokemonFilters";
import { useAuth } from "../auth/useAuth";

export function PokemonPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    [],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
      setPage(1);
    },
    [],
  );

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="pokemon-page">
      <header className="pokemon-header">
        <div className="pokemon-header-content">
          <div className="pokemon-header-top">
            <div>
              <span className="pokemon-eyebrow">
                POKÉDEX
              </span>

              <h1>Explora el mundo Pokémon</h1>

              <p>
                Descubre Pokémon, tipos, habilidades y
                estadísticas.
              </p>
            </div>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="pokemon-content">
        <PokemonSearch
          value={search}
          onChange={handleSearchChange}
        />

        <PokemonFilters
          type={type}
          onTypeChange={handleTypeChange}
        />

        <PokemonList
          search={search}
          type={type}
          page={page}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}