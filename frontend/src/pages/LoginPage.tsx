import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
import { useAuth } from "../auth/useAuth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated, isAuthenticated } = useAuth();

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
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
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
                <h1>Iniciar sesión</h1>
                <p>
                Accede para explorar la Pokédex.
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
                    setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                    ? "Ingresando..."
                    : "Ingresar"}
                </button>
            </form>

            <p className="login-footer">
            ¿No tienes una cuenta?{" "}
            <Link to="/register">
                Regístrate
            </Link>
            </p>

            <p className="login-footer">
                Datos sincronizados desde PokéAPI
            </p>
            </section>
        </main>
    );
}