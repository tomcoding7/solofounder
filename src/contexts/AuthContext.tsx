'use client';

import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'test-user', email: 'test@example.com' },
  loading: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{
      user: { id: 'test-user', email: 'test@example.com' },
      loading: false
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 