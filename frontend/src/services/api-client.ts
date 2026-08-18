const API_URL = import.meta.env.VITE_API_URL;

interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken =
    localStorage.getItem("refreshToken");

    if (!refreshToken) {
        return null;
    }

    const response = await fetch(
        `${API_URL}/auth/refresh`,
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.dispatchEvent(
        new Event("auth:session-expired"),
    );

    return null;
    }

    const result: RefreshResponse =
        await response.json();

    localStorage.setItem(
        "accessToken",
        result.data.accessToken,
    );

    return result.data.accessToken;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  let accessToken =
    localStorage.getItem("accessToken");

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    },
  );

  if (response.status !== 401) {
    return response;
  }

  accessToken = await refreshAccessToken();

  if (!accessToken) {
    return response;
  }

  headers.set(
    "Authorization",
    `Bearer ${accessToken}`,
  );

  response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    },
  );

  return response;
}