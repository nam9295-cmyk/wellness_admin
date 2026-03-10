import type { AdminUserRole, UserRole } from '../types/member';

export function isAdminRole(role: UserRole): role is AdminUserRole {
  return role === 'superAdmin' || role === 'orgAdmin';
}

export function canAccessOrganization(
  role: UserRole,
  currentOrganizationId: string | null | undefined,
  targetOrganizationId: string | null | undefined,
) {
  if (role === 'superAdmin') return true;
  if (role === 'orgAdmin') return Boolean(currentOrganizationId) && currentOrganizationId === targetOrganizationId;
  return false;
}
