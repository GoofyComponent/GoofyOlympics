import * as React from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  user: { username: string; role: string } | null;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

const key = 'tanstack.auth.user';

function getStoredUser() {
  const user = localStorage.getItem(key);
  return user ? JSON.parse(user) : null;
}

function setStoredUser(user: { username: string; role: string } | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<{ username: string; role: string } | null>(
    getStoredUser(),
  );
  const isAuthenticated = !!user;

  const logout = React.useCallback(() => {
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback((username: string, password: string) => {
    fetch('https://api-olympics.stroyco.eu/auth/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then(() => {
        const newUser = { username, role: 'admin' };
        setStoredUser(newUser);
        setUser(newUser);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}