import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokemonPage } from "./pages/PokemonPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PokemonPage />}
        />

        <Route
          path="/pokemon/:id"
          element={<PokemonDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;