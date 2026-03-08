import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { UserRole } from '../types/member';

type AuthContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  isAdmin: boolean;
  isParent: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>('admin');

  const toggleRole = useCallback(() => {
    setRole((prev) => (prev === 'admin' ? 'parent' : 'admin'));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      setRole,
      toggleRole,
      isAdmin: role === 'admin',
      isParent: role === 'parent',
    }),
    [role, toggleRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
