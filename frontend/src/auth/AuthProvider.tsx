import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { logoutRequest } from "../services/auth.service";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] =
    useState(() => {
      return Boolean(
        localStorage.getItem("accessToken"),
      );
    });
    useEffect(() => {
    function handleSessionExpired() {
        setIsAuthenticated(false);
    }

    window.addEventListener(
        "auth:session-expired",
        handleSessionExpired,
    );

    return () => {
        window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired,
        );
    };
    }, []);

  async function logout() {
    const refreshToken =
      localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        setAuthenticated: setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}