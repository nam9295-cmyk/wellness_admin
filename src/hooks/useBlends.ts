import { useEffect, useState } from 'react';
import { fetchBlends, type BlendDoc } from '../lib/firebase/reads';

interface UseBlendsResult {
  blends: BlendDoc[];
  loading: boolean;
  error: string | null;
  /** true = Firestore에서 데이터 로드 성공, false = 실패 또는 빈 결과 */
  isFirestore: boolean;
}

/**
 * Firestore 'teas' 컬렉션에서 블렌드 카탈로그를 가져오는 훅.
 *
 * - 성공 시: Firestore 데이터 반환, isFirestore = true
 * - 실패/빈 결과 시: blends = [], isFirestore = false
 * - 컴포넌트는 isFirestore === false 일 때 기존 mockData를 사용하면 됨
 */
export function useBlends(): UseBlendsResult {
  const [blends, setBlends] = useState<BlendDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchBlends();
        if (cancelled) return;

        if (data.length > 0) {
          setBlends(data);
          setIsFirestore(true);
        } else {
          // Firestore 컬렉션이 비어있음 → fallback 신호
          setIsFirestore(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Firestore 읽기 실패';
        setError(message);
        setIsFirestore(false);
        // 개발 디버깅용 로그 — 프로덕션에서 제거 예정
        console.warn('[useBlends] Firestore fetch failed, using mockData fallback:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { blends, loading, error, isFirestore };
}
