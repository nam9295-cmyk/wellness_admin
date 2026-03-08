/**
 * Firestore conditionNotes 읽기 훅.
 *
 * members/{memberId}/conditionNotes + conditionNotesPrivate 서브컬렉션에서
 * 노트를 가져와 CareNote[] 형태로 반환합니다.
 *
 * - 성공 (1개 이상): Firestore 데이터 → isFirestore = true
 * - 빈 결과 / 실패: mockData careNotes에서 memberId 필터링 → isFirestore = false
 */

import { useEffect, useState } from 'react';
import {
  fetchAllConditionNotesForMember,
  type ConditionNoteDoc,
} from '../lib/firebase/reads';
import { careNotes as mockCareNotes } from '../data/mockData';
import type { CareNote } from '../types/member';

// ---------------------------------------------------------------------------
// ConditionNoteDoc → CareNote 매핑 (동일 shape — 직접 매핑)
// ---------------------------------------------------------------------------

function conditionNoteDocToCareNote(doc: ConditionNoteDoc): CareNote {
  return {
    id: doc.id,
    memberId: doc.memberId,
    authorId: doc.authorId,
    content: doc.content,
    visibility: doc.visibility,
    category: doc.category,
    createdAt: doc.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseConditionNotesResult {
  notes: CareNote[];
  loading: boolean;
  error: string | null;
  isFirestore: boolean;
}

/**
 * 특정 회원의 컨디션 노트를 Firestore에서 가져오는 훅.
 *
 * - 관리자 뷰: conditionNotes + conditionNotesPrivate 병합 (fetchAllConditionNotesForMember)
 * - 성공: Firestore 데이터 → isFirestore = true
 * - 실패/빈 결과: mockData careNotes에서 해당 memberId 필터 → isFirestore = false
 */
export function useConditionNotes(memberId: string | undefined): UseConditionNotesResult {
  const mockNotes = memberId
    ? mockCareNotes.filter((n) => n.memberId === memberId)
    : [];

  const [notes, setNotes] = useState<CareNote[]>(mockNotes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);

  useEffect(() => {
    if (!memberId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fallback = mockCareNotes.filter((n) => n.memberId === memberId);

    async function load() {
      setLoading(true);
      try {
        const docs = await fetchAllConditionNotesForMember(memberId!);
        if (cancelled) return;

        if (docs.length > 0) {
          setNotes(docs.map(conditionNoteDocToCareNote));
          setIsFirestore(true);
        } else {
          // Firestore에 노트 없음 → mockData fallback
          setNotes(fallback);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore conditionNotes 읽기 실패';
        setError(message);
        setNotes(fallback);
        setIsFirestore(false);
        console.warn('[useConditionNotes] Firestore fetch failed, using mockData fallback:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [memberId]);

  return { notes, loading, error, isFirestore };
}
