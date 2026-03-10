import { useCallback, useEffect, useState } from 'react';
import { canAccessOrganization } from '../lib/accessControl';
import {
  fetchMembers,
  fetchMemberById,
  fetchMembersByOrganization,
  type MemberDoc,
} from '../lib/firebase/reads';
import { members as mockMembers } from '../data/mockData';
import type { Member, ParentConnection, UserRole } from '../types/member';

// ---------------------------------------------------------------------------
// MemberDoc → Member 매핑
// ---------------------------------------------------------------------------

const DEFAULT_PARENT_CONNECTION: ParentConnection = {
  guardianName: null,
  relationship: '미연결',
  connected: false,
  lastSharedAt: '',
  channel: '미설정',
  nextShareNote: '',
};

/**
 * Firestore MemberDoc → UI Member 타입 변환.
 *
 * - 직접 매핑 가능한 필드: Firestore 우선
 * - 서브컬렉션/복합 필드(metrics, savedTeas 등): 같은 ID의 mockData에서 보강
 * - mockData에도 없으면 빈 기본값
 */
function memberDocToMember(doc: MemberDoc): Member {
  const mock = mockMembers.find((m) => m.id === doc.id);

  return {
    // Firestore 직접 매핑 (우선)
    id: doc.id,
    name: doc.name,
    age: doc.age,
    room: doc.room,
    group: doc.group,
    organizationId: doc.organizationId ?? mock?.organizationId ?? '',
    organizationName: doc.organizationName ?? mock?.organizationName ?? '',
    role: doc.role ?? mock?.role ?? 'member',
    isTestAccount: doc.isTestAccount ?? mock?.isTestAccount ?? false,
    testGroup: doc.testGroup ?? mock?.testGroup ?? null,
    status: doc.status,
    lastActiveAt: doc.lastActiveAt ?? mock?.lastActiveAt ?? '',
    lastCheckTime: doc.lastCheckTime,
    todayRecommendedTea: doc.todayBlendName,
    todayTeaId: doc.todayBlendId,
    todayFocus: doc.todayFocus,
    note: doc.note,

    // 서브컬렉션/복합 필드 — mockData에서 보강 (향후 Firestore 서브컬렉션 연결 시 교체)
    carePoint: mock?.carePoint ?? '',
    parentConnection: mock?.parentConnection ?? DEFAULT_PARENT_CONNECTION,
    metrics: mock?.metrics ?? [],
    savedTeas: mock?.savedTeas ?? [],
    weeklyStatus: mock?.weeklyStatus ?? [],
  };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

interface UseMembersResult {
  members: Member[];
  loading: boolean;
  error: string | null;
  isFirestore: boolean;
  /** Firestore에서 회원 목록을 다시 가져옵니다 */
  refetch: () => void;
}

interface UseMembersOptions {
  role?: UserRole;
  organizationId?: string | null;
}

/**
 * 회원 목록을 Firestore members 컬렉션에서 가져오는 훅.
 *
 * - 성공: Firestore 데이터 + mockData 보강 → isFirestore = true
 * - 실패/빈 결과: mockMembers 전체 반환 → isFirestore = false
 */
export function useMembers(options: UseMembersOptions = {}): UseMembersResult {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (options.role === 'orgAdmin' && !options.organizationId) {
          setMembers([]);
          setIsFirestore(false);
          return;
        }

        const docs =
          options.role === 'orgAdmin' && options.organizationId
            ? await fetchMembersByOrganization(options.organizationId)
            : await fetchMembers();
        if (cancelled) return;

        if (docs.length > 0) {
          const scopedMembers = docs
            .map(memberDocToMember)
            .filter((member) => canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, member.organizationId));
          setMembers(scopedMembers);
          setIsFirestore(true);
        } else {
          const fallbackMembers = mockMembers.filter((member) =>
            canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, member.organizationId),
          );
          setMembers(fallbackMembers);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore members 읽기 실패';
        setError(message);
        const fallbackMembers = mockMembers.filter((member) =>
          canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, member.organizationId),
        );
        setMembers(fallbackMembers);
        setIsFirestore(false);
        console.warn('[useMembers] Firestore fetch failed, using mockData fallback:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetchKey, options.organizationId, options.role]);

  return { members, loading, error, isFirestore, refetch };
}

interface UseMemberResult {
  member: Member | null;
  loading: boolean;
  error: string | null;
  isFirestore: boolean;
}

/**
 * 단일 회원 데이터를 Firestore에서 가져오는 훅.
 *
 * - 성공: Firestore 데이터 + mockData 보강
 * - 실패: mockMembers에서 ID 매칭
 */
export function useMember(memberId: string | undefined, options: UseMembersOptions = {}): UseMemberResult {
  const mockMember = memberId ? mockMembers.find((m) => m.id === memberId) ?? null : null;

  const [member, setMember] = useState<Member | null>(mockMember);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);

  useEffect(() => {
    if (!memberId) {
      setMember(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        if (options.role === 'orgAdmin' && !options.organizationId) {
          setMember(null);
          setError('organizationId가 없는 orgAdmin은 회원 데이터를 조회할 수 없습니다.');
          setIsFirestore(false);
          return;
        }

        const doc = await fetchMemberById(memberId!);
        if (cancelled) return;

        if (doc) {
          const mappedMember = memberDocToMember(doc);
          if (!canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, mappedMember.organizationId)) {
            setMember(null);
            setError('해당 조직의 회원을 볼 수 있는 권한이 없습니다.');
            setIsFirestore(true);
            return;
          }
          setMember(mappedMember);
          setIsFirestore(true);
        } else {
          // Firestore에 해당 문서 없음 → mockData fallback
          if (mockMember && canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, mockMember.organizationId)) {
            setMember(mockMember);
          } else {
            setMember(null);
          }
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore member 읽기 실패';
        setError(message);
        if (mockMember && canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, mockMember.organizationId)) {
          setMember(mockMember);
        } else {
          setMember(null);
        }
        setIsFirestore(false);
        console.warn('[useMember] Firestore fetch failed, using mockData fallback:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [memberId, options.organizationId, options.role]);

  return { member, loading, error, isFirestore };
}
