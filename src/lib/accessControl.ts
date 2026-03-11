import type { AdminUserRole, AdminUserStatus, UserRole } from '../types/member';

export function isAdminRole(role: UserRole): role is AdminUserRole {
  return role === 'superAdmin' || role === 'orgAdmin';
}

export function hasActiveAdminStatus(status: AdminUserStatus | null | undefined) {
  return status === 'active';
}

export function canAccessOrganization(
  role: UserRole,
  currentOrganizationId: string | null | undefined,
  targetOrganizationId: string | null | undefined,
  status?: AdminUserStatus | null,
) {
  if (isAdminRole(role) && !hasActiveAdminStatus(status)) return false;
  if (role === 'superAdmin') return true;
  if (role === 'orgAdmin') return Boolean(currentOrganizationId) && currentOrganizationId === targetOrganizationId;
  return false;
}

export function canAccessAdminRoute(role: UserRole, status: AdminUserStatus | null | undefined) {
  return isAdminRole(role) && hasActiveAdminStatus(status);
}
