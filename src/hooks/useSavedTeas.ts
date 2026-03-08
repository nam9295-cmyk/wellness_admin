import { useEffect, useState } from 'react';
import { fetchSavedTeas, type SavedTeaDoc } from '../lib/firebase/reads';

interface UseSavedTeasResult {
  savedTeas: SavedTeaDoc[];
  loading: boolean;
  error: string | null;
  /**
   * true = Firestore 읽기 자체는 성공
   * 빈 배열이어도 연결 성공이면 true
   */
  isFirestore: boolean;
}

export function useSavedTeas(memberId: string | undefined): UseSavedTeasResult {
  const [savedTeas, setSavedTeas] = useState<SavedTeaDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirestore, setIsFirestore] = useState(false);

  useEffect(() => {
    if (!memberId) {
      setSavedTeas([]);
      setLoading(false);
      setIsFirestore(false);
      return;
    }

    const targetMemberId = memberId;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSavedTeas(targetMemberId);
        if (cancelled) return;

        setSavedTeas(data);
        setIsFirestore(true);
      } catch (err) {
        if (cancelled) return;

        const message = err instanceof Error ? err.message : 'Firestore savedTeas 읽기 실패';
        setError(message);
        setSavedTeas([]);
        setIsFirestore(false);
        console.warn('[useSavedTeas] Firestore fetch failed:', message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [memberId]);

  return { savedTeas, loading, error, isFirestore };
}
