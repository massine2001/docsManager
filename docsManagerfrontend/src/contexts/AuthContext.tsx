import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/models';
import { fetchUserById } from '../api/userPageApi';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = { children: ReactNode };

let BFF_BASE = import.meta.env.VITE_BFF_URL || "http://localhost:5173";

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const api = async (input: RequestInfo, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? `${input}` 
        : input;
    return fetch(url as string, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api(`${BFF_BASE}/api/me`, { method: 'GET' });
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        setUser(await fetchUserById(data.userId));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const login = () => {
    const returnTo = encodeURIComponent(window.location.href);
    window.location.href = `${BFF_BASE}/oauth2/authorization/spa?returnTo=${returnTo}`;
    return;
  };

  const logout = async () => {
    try {
      await api(`${BFF_BASE}/logout`, { method: 'POST' });
    } catch {}
    setUser(null);
    window.location.href = '/';
    return;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
