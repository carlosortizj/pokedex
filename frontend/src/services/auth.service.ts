const API_URL = import.meta.env.VITE_API_URL;

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    user: {
      id: number;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(
  input: LoginInput,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error("LOGIN_FAILED");
  }

  const result: LoginResponse =
    await response.json();

  localStorage.setItem(
    "accessToken",
    result.data.accessToken,
  );

  localStorage.setItem(
    "refreshToken",
    result.data.refreshToken,
  );
}

export async function logoutRequest(
  refreshToken: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("LOGOUT_FAILED");
  }
}

interface RegisterInput {
  email: string;
  password: string;
}

export async function register(
  input: RegisterInput,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message ?? "No fue posible crear la cuenta: La contraseña d ebe tener más de 8 caracteres",
    );
  }
}