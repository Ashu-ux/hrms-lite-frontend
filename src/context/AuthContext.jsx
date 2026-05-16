import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";
import API from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!storage.getToken()) return;
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch {
      // token invalid/expired
      storage.clearToken();
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (storage.getToken()) {
        try {
          // If interceptor isn't set (yet), rely on backend accepting no header is unlikely.
          // We still attempt profile fetch.
          await refreshProfile();
        } catch {
          // handled in refreshProfile
        }
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshProfile]);

  const setAuthToken = useCallback((newToken) => {
    storage.setToken(newToken);
    setToken(newToken);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await API.post("/auth/login", { email, password });
    const newToken = res.data?.token;
    if (!newToken) {
      throw new Error("Login failed: token missing in response.");
    }
    setAuthToken(newToken);
    const profile = await API.get("/auth/profile");
    setUser(profile.data);
    return profile.data;
  }, [setAuthToken]);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await API.post("/auth/register", { name, email, password });
    const newToken = res.data?.token;
    if (!newToken) {
      // allow backend returning no token: user can login manually
      return null;
    }
    setAuthToken(newToken);
    const profile = await API.get("/auth/profile");
    setUser(profile.data);
    return profile.data;
  }, [setAuthToken]);

  const logout = useCallback(() => {
    storage.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile
    }),
    [token, user, loading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


