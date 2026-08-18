import { createContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );