import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { auth } from '../lib/firebase';
import { fetchAdminUserById } from '../lib/firebase/reads';
import type { AdminUserStatus, UserRole } from '../types/member';
import { canAccessAdminRoute, canAccessOrganization, isAdminRole } from '../lib/accessControl';

type AuthContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  organizationId: string | null;
  setOrganizationId: (organizationId: string | null) => void;
  uid: string | null;
  status: AdminUserStatus | null;
  isHydrating: boolean;
  isSessionLocked: boolean;
  toggleRole: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOrgAdmin: boolean;
  isParent: boolean;
  hasAdminAccess: boolean;
  canAccessOrg: (targetOrganizationId: string | null | undefined) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>('orgAdmin');
  const [organizationId, setOrganizationId] = useState<string | null>('wellness-app');
  const [uid, setUid] = useState<string | null>(null);
  const [status, setStatus] = useState<AdminUserStatus | null>('active');
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSessionLocked, setIsSessionLocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsHydrating(true);

      if (!user) {
        setUid(null);
        setStatus('active');
        setIsSessionLocked(false);
        setIsHydrating(false);
        return;
      }

      setUid(user.uid);

      try {
        const adminUser = await fetchAdminUserById(user.uid);

        if (!adminUser) {
          setRole('parent');
          setOrganizationId(null);
          setStatus(null);
          setIsSessionLocked(true);
          return;
        }

        setRole(adminUser.role);
        setOrganizationId(adminUser.organizationId);
        setStatus(adminUser.status);
        setIsSessionLocked(true);
      } catch (error) {
        console.error('[AuthProvider] failed to hydrate admin session:', error);
        setRole('parent');
        setOrganizationId(null);
        setStatus(null);
        setIsSessionLocked(true);
      } finally {
        setIsHydrating(false);
      }
    });

    return unsubscribe;
  }, []);

  const toggleRole = useCallback(() => {
    if (isSessionLocked) return;
    setRole((prev) => (prev === 'parent' ? 'orgAdmin' : 'parent'));
  }, [isSessionLocked]);

  const handleSetRole = useCallback((nextRole: UserRole) => {
    if (isSessionLocked) return;
    setRole(nextRole);
  }, [isSessionLocked]);

  const handleSetOrganizationId = useCallback((nextOrganizationId: string | null) => {
    if (isSessionLocked) return;
    setOrganizationId(nextOrganizationId);
  }, [isSessionLocked]);

  const hasAdminAccess = canAccessAdminRoute(role, status);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      setRole: handleSetRole,
      organizationId,
      setOrganizationId: handleSetOrganizationId,
      uid,
      status,
      isHydrating,
      isSessionLocked,
      toggleRole,
      isAdmin: hasAdminAccess,
      isSuperAdmin: role === 'superAdmin',
      isOrgAdmin: role === 'orgAdmin',
      isParent: role === 'parent',
      hasAdminAccess,
      canAccessOrg: (targetOrganizationId) => canAccessOrganization(role, organizationId, targetOrganizationId, status),
    }),
    [handleSetOrganizationId, handleSetRole, hasAdminAccess, isHydrating, isSessionLocked, organizationId, role, status, toggleRole, uid],
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
