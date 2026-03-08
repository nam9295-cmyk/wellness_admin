/**
 * Firestore dailySummaries 읽기 훅.
 *
 * members/{memberId}/dailySummaries 서브컬렉션에서
 * 최근 N일치 요약을 가져옵니다.
 *
 * - 성공 (1개 이상): Firestore 데이터 → isFirestore = true
 * - 빈 결과 / 실패: summaries = [] → isFirestore = false
 *
 * `today`는 오늘 날짜와 일치하는 요약을 편의상 분리하여 반환합니다.
 */

import { useEffect, useState } from 'react';
import { fetchDailySummaries, type DailySummaryDoc } from '../lib/firebase/reads';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseDailySummariesResult {
  summaries: DailySummaryDoc[];
  today: DailySummaryDoc | null;
  loading: boolean;
  error: string | null;
  isFirestore: boolean;
}

/**
 * 특정 회원의 일일 요약을 Firestore에서 가져오는 훅.
 *
 * @param memberId - 대상 회원 ID (undefined → 빈 배열)
 * @param limitCount - 가져올 최대 일수 (기본 7)
 */
export function useDailySummaries(
  memberId: string | undefined,
  limitCount = 7,
): UseDailySummariesResult {
  const [summaries, setSummaries] = useState<DailySummaryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);

  useEffect(() => {
    if (!memberId) {
      setSummaries([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const docs = await fetchDailySummaries(memberId!, limitCount);
        if (cancelled) return;

        if (docs.length > 0) {
          setSummaries(docs);
          setIsFirestore(true);
        } else {
          setSummaries([]);
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore dailySummaries 읽기 실패';
        setError(message);
        setSummaries([]);
        setIsFirestore(false);
        console.warn('[useDailySummaries] Firestore fetch failed:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [memberId, limitCount]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = summaries.find((s) => s.date === todayStr) ?? null;

  return { summaries, today, loading, error, isFirestore };
}
