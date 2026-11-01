import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { setUnauthorizedHandler } from "../services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const removeUnauthorizedHandler = setUnauthorizedHandler(() => {
      authService.clearSession();
      setUser(null);
    });
    authService.validateSession()
      .then(setUser)
      .catch((error) => {
        console.error("Unable to validate the saved session:", error);
        setUser(authService.getSession());
      })
      .finally(() => setInitializing(false));
    return removeUnauthorizedHandler;
  }, []);

  const login = async (email, password) => setUser(await authService.login(email, password));
  const register = async (form) => setUser(await authService.register(form));
  const updateProfile = async (changes) => setUser(await authService.updateProfile(user.id, changes));
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, initializing, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
