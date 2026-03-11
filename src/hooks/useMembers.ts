import { useCallback, useEffect, useState } from 'react';
import { canAccessOrganization } from '../lib/accessControl';
import {
  fetchMembers,
  fetchMemberById,
  fetchMembersByOrganization,
  type MemberDoc,
} from '../lib/firebase/reads';
import type { AdminUserStatus, Member, ParentConnection, UserRole } from '../types/member';

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
 * - 서브컬렉션/복합 필드(metrics, savedTeas, weeklyStatus 등): 여기서는 비워두고
 *   상세 화면 훅(useSavedTeas, useDailySummaries, useConditionNotes)에서 읽습니다.
 */
function memberDocToMember(doc: MemberDoc): Member {
  return {
    id: doc.id,
    name: doc.name,
    age: doc.age,
    room: doc.room,
    group: doc.group,
    organizationId: doc.organizationId ?? '',
    organizationName: doc.organizationName ?? '',
    role: doc.role ?? 'member',
    isTestAccount: doc.isTestAccount ?? false,
    testGroup: doc.testGroup ?? null,
    status: doc.status,
    lastActiveAt: doc.lastActiveAt ?? '',
    lastCheckTime: doc.lastCheckTime,
    todayRecommendedTea: doc.todayBlendName,
    todayTeaId: doc.todayBlendId,
    todayFocus: doc.todayFocus,
    note: doc.note,
    carePoint: '',
    parentConnection: DEFAULT_PARENT_CONNECTION,
    metrics: [],
    savedTeas: [],
    weeklyStatus: [],
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
  status?: AdminUserStatus | null;
}

/**
 * 회원 목록을 Firestore members 컬렉션에서 가져오는 훅.
 *
 * - 성공: Firestore 데이터 반환 → isFirestore = true
 * - 실패/빈 결과: 빈 배열 반환 → isFirestore = false
 */
export function useMembers(options: UseMembersOptions = {}): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
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
            .filter((member) =>
              canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, member.organizationId, options.status),
            );
          setMembers(scopedMembers);
          setIsFirestore(true);
        } else {
          setMembers([]);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore members 읽기 실패';
        setError(message);
        setMembers([]);
        setIsFirestore(false);
        console.warn('[useMembers] Firestore fetch failed:', message);
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
 * - 성공: Firestore 데이터 반환
 * - 실패: null 반환
 */
export function useMember(memberId: string | undefined, options: UseMembersOptions = {}): UseMemberResult {
  const [member, setMember] = useState<Member | null>(null);
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
          if (!canAccessOrganization(options.role ?? 'superAdmin', options.organizationId, mappedMember.organizationId, options.status)) {
            setMember(null);
            setError('해당 조직의 회원을 볼 수 있는 권한이 없습니다.');
            setIsFirestore(true);
            return;
          }
          setMember(mappedMember);
          setIsFirestore(true);
        } else {
          setMember(null);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore member 읽기 실패';
        setError(message);
        setMember(null);
        setIsFirestore(false);
        console.warn('[useMember] Firestore fetch failed:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [memberId, options.organizationId, options.role]);

  return { member, loading, error, isFirestore };
}
