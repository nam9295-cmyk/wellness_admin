import type { DailySummaryDoc } from './firebase/reads';

const SLEEP_SCORE_LABELS: Record<number, string> = {
  1: '매우 부족',
  2: '부족',
  3: '보통',
  4: '좋음',
  5: '매우 좋음',
};

type MetricKey = 'sleep' | 'mood' | 'stress' | 'fatigue' | 'focus';

export function formatDailySummaryValue(
  key: MetricKey,
  value: DailySummaryDoc[MetricKey],
  fallback = '기록 없음',
) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (key === 'sleep') {
      return SLEEP_SCORE_LABELS[value] ?? `${value}/5`;
    }

    if (key === 'mood' || key === 'stress' || key === 'fatigue') {
      return `${value}/5`;
    }

    return String(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  return fallback;
}
