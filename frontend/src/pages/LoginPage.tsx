import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
import { useAuth } from "../auth/useAuth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated } = useAuth();

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
        ) {
            event.preventDefault();

            try {
                setLoading(true);
                setError(null);

                await login({
                email,
                password,
                });

                setAuthenticated(true);
                navigate("/");
            } catch {
                setError("Correo o contraseña incorrectos.");
            } finally {
                setLoading(false);
            }
        }

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="pokemon-eyebrow">
          POKÉDEX ACCESS
        </span>

        <h1>Iniciar sesión</h1>

        <p>
          Ingresa tus credenciales para acceder a la Pokédex.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </label>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}