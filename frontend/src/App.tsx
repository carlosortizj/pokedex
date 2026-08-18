import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokemonPage } from "./pages/PokemonPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PokemonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pokemon/:id"
          element={
            <ProtectedRoute>
              <PokemonDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;