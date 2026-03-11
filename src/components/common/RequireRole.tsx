import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/member';

type RequireRoleProps = {
  roles: UserRole[];
  redirectTo?: string;
};

export function RequireRole({ roles, redirectTo }: RequireRoleProps) {
  const { role, hasAdminAccess, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (!roles.includes(role) || !hasAdminAccess) {
    const fallback = redirectTo ?? (role === 'parent' ? '/parent-mode' : '/');
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
