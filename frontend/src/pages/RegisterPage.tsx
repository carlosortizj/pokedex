import { useState } from "react";
import type { SubmitEvent } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { register } from "../services/auth.service";
import { useAuth } from "../auth/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError(
        "Las contraseñas no coinciden.",
      );

      return;
    }

    try {
      setLoading(true);
      setError(null);

      await register({
        email,
        password,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="login-indicator" />

          <span className="login-eyebrow">
            POKÉDEX ACCESS
          </span>
        </div>

        <div className="login-heading">
          <h1>Crear cuenta</h1>

          <p>
            Regístrate para acceder a la Pokédex.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label className="login-field">
            <span>Correo electrónico</span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Contraseña</span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="login-field">
            <span>
              Confirmar contraseña
            </span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creando cuenta..."
              : "Registrarse"}
          </button>
        </form>

        <p className="login-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}