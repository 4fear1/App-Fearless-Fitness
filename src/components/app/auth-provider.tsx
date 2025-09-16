"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if a user is logged in from a previous session
    const loggedInUser = sessionStorage.getItem('fearless-user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else if (pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  const login = (username: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('fearless-users') || '{}');
    if (storedUsers[username] && storedUsers[username] === password) {
      const userData = { username };
      setUser(userData);
      sessionStorage.setItem('fearless-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('fearless-user');
    router.push('/login');
  };

  const register = (username: string, password: string) => {
    if (!username || !password) {
        throw new Error('Usuário e senha são obrigatórios.');
    }
    const storedUsers = JSON.parse(localStorage.getItem('fearless-users') || '{}');
    if (storedUsers[username]) {
      throw new Error('Este nome de usuário já existe.');
    }
    const newUsers = { ...storedUsers, [username]: password };
    localStorage.setItem('fearless-users', JSON.stringify(newUsers));
  };

  const value = { user, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
