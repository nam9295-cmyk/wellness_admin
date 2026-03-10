import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { UserRole } from '../types/member';
import { canAccessOrganization, isAdminRole } from '../lib/accessControl';

type AuthContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  organizationId: string | null;
  setOrganizationId: (organizationId: string | null) => void;
  toggleRole: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOrgAdmin: boolean;
  isParent: boolean;
  canAccessOrg: (targetOrganizationId: string | null | undefined) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>('orgAdmin');
  const [organizationId, setOrganizationId] = useState<string | null>('org-demo-001');

  const toggleRole = useCallback(() => {
    setRole((prev) => (prev === 'parent' ? 'orgAdmin' : 'parent'));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      setRole,
      organizationId,
      setOrganizationId,
      toggleRole,
      isAdmin: isAdminRole(role),
      isSuperAdmin: role === 'superAdmin',
      isOrgAdmin: role === 'orgAdmin',
      isParent: role === 'parent',
      canAccessOrg: (targetOrganizationId) => canAccessOrganization(role, organizationId, targetOrganizationId),
    }),
    [organizationId, role, toggleRole],
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
