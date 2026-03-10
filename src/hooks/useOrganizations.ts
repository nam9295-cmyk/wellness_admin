import { useEffect, useState } from 'react';
import { organizations as mockOrganizations } from '../data/mockData';
import { fetchOrganizations, type OrganizationDoc } from '../lib/firebase/reads';
import type { Organization } from '../types/member';

function organizationDocToOrganization(doc: OrganizationDoc): Organization {
  return {
    id: doc.id,
    name: doc.name,
    type: doc.type,
    status: doc.status,
    isTestOrganization: doc.isTestOrganization,
    ownerAdminUid: doc.ownerAdminUid,
    memberCount: doc.memberCount,
    activeMemberCount: doc.activeMemberCount,
    lastActivityAt: doc.lastActivityAt,
    createdAt: doc.createdAt,
  };
}

interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  isFirestore: boolean;
  refetch: () => void;
}

export function useOrganizations(): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const docs = await fetchOrganizations();
        if (cancelled) return;

        if (docs.length > 0) {
          setOrganizations(docs.map(organizationDocToOrganization));
          setIsFirestore(true);
        } else {
          setOrganizations(mockOrganizations);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;

        const message = err instanceof Error ? err.message : 'Firestore organizations 읽기 실패';
        setError(message);
        setOrganizations(mockOrganizations);
        setIsFirestore(false);
        console.warn('[useOrganizations] Firestore fetch failed, using mockData fallback:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return {
    organizations,
    loading,
    error,
    isFirestore,
    refetch: () => setRefreshKey((prev) => prev + 1),
  };
}
