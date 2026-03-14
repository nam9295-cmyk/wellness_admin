import { useState } from 'react';
import { ParentStatusLabel } from '../components/common/ParentStatusLabel';
import { parentChildViews as mockParentViews } from '../data/mockData';
import type { MemberStatus, ParentChildView } from '../types/member';
import { useConditionNotes } from '../hooks/useConditionNotes';
import { useDailySummaries } from '../hooks/useDailySummaries';
import { useMembers } from '../hooks/useMembers';
import { formatDailySummaryValue } from '../lib/dailySummaryDisplay';

const trendDotColor: Record<MemberStatus, string> = {
  Stable: 'bg-brand-success',
  Attention: 'bg-brand-error',
  Check: 'bg-brand-primary',
};

const heroOneLiner: Record<MemberStatus, string> = {
  Stable: '오늘은 편안한 하루를 보내고 계세요',
  Attention: '오늘 조금 더 살펴보는 부분이 있어요',
  Check: '선생님이 꼼꼼히 확인하고 있어요',
};

export function ParentModePage() {
  const { members } = useMembers();
  const [selectedChildId, setSelectedChildId] = useState('');

  // Member → ParentChildView 변환 (mockParentViews 보강)
  const childList: ParentChildView[] = members.map((m) => {
    const mock = mockParentViews.find((p) => p.childId === m.id);
    return {
      childId: m.id,
      childName: m.name,
      group: m.group,
      status: m.status,
      lastCheckTime: m.lastCheckTime,
      todayChecked: mock?.todayChecked ?? false,
      todayMood: mock?.todayMood ?? '',
      sleepHours: mock?.sleepHours ?? '',
      stress: mock?.stress ?? '',
      fatigue: mock?.fatigue ?? '',
      focus: mock?.focus ?? '',
      todayTea: m.todayRecommendedTea || mock?.todayTea || '',
      carePoints: mock?.carePoints ?? [],
      recentTrend: mock?.recentTrend ?? [],
      encouragements: mock?.encouragements ?? [],
      rewardCount: mock?.rewardCount ?? 0,
    };
  });

  const child = childList.find((c) => c.childId === selectedChildId) ?? childList[0];

  // Firestore hooks (선택된 회원의 실시간 데이터)
  const { today, summaries, isFirestore: isSummaryFs } = useDailySummaries(child?.childId);
  const { notes: allConditionNotes } = useConditionNotes(child?.childId);

  if (!child) {
    return (
      <div className="rounded-[24px] border border-atelier-border bg-atelier-surface p-8 text-center">
        <p className="text-lg font-semibold text-atelier-title">연결된 가족 정보가 없어요</p>
        <p className="mt-2 text-sm text-atelier-text-soft">관리자에게 문의해 가족 연결을 진행해 주세요.</p>
      </div>
    );
  }

  // ── Firestore → mockData fallback (가족 뷰 기준) ──
  const visibleNotes = allConditionNotes.filter((n) => n.visibility === 'parent_visible');

  // 오늘 컨디션 (dailySummary 우선, 없으면 mockData)
  const todayChecked = isSummaryFs && today ? true : child.todayChecked;
  const status = isSummaryFs && today ? today.status : child.status;
  const todayMood = isSummaryFs && today
    ? formatDailySummaryValue('mood', today.mood)
    : child.todayMood;
  const sleepHours = isSummaryFs && today
    ? formatDailySummaryValue('sleep', today.sleep)
    : child.sleepHours;
  const stress = isSummaryFs && today
    ? formatDailySummaryValue('stress', today.stress)
    : child.stress || '';
  const fatigue = isSummaryFs && today
    ? formatDailySummaryValue('fatigue', today.fatigue)
    : child.fatigue;
  const focus = isSummaryFs && today
    ? formatDailySummaryValue('focus', today.focus)
    : child.focus;
  const todayTea = (isSummaryFs && today?.blendName) || child.todayTea;

  // 최근 흐름 (dailySummaries → mockData fallback)
  const recentTrend = isSummaryFs && summaries.length > 0
    ? [...summaries].reverse().map((s) => ({
        day: s.date.slice(5).replace('-', '.'),
        status: s.status,
        summary: s.adminSummary,
        parentSummary: s.parentSummary,
      }))
    : child.recentTrend;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* 자녀 선택 */}
      {childList.length > 1 ? (
        <div className="flex items-center gap-3">
          {childList.map((c) => (
            <button
              key={c.childId}
              type="button"
              onClick={() => setSelectedChildId(c.childId)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                c.childId === selectedChildId
                  ? 'bg-atelier-deep-green text-white shadow-sm'
                  : 'bg-atelier-surface text-atelier-text-muted ring-1 ring-atelier-border hover:bg-atelier-surface-muted'
              }`}
            >
              {c.childName}
            </button>
          ))}
        </div>
      ) : null}

      {/* ── 인사 영역 + 오늘의 한마디 ── */}
      <section className="rounded-[28px] bg-gradient-to-br from-atelier-deep-green to-atelier-cocoa-strong p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium text-brand-primary-light">
          {todayChecked ? '오늘 체크인 완료' : '체크인 대기 중'}
        </p>
        <h2 className="mt-2 text-3xl font-semibold">{child.childName}님, 오늘도 좋은 하루예요</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          {todayChecked
            ? '오늘 컨디션 확인이 끝났어요. 아래에서 자세히 살펴보실 수 있어요.'
            : '아직 오늘 체크인 전이에요. 곧 업데이트될 거예요.'}
        </p>

        {/* 오늘의 한마디 pill */}
        <div className="mt-5 flex items-center gap-3">
          <ParentStatusLabel status={status} />
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {heroOneLiner[status]}
          </span>
        </div>
      </section>

      {/* ── 오늘 컨디션 요약 (sub-label 제거) ── */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-atelier-title">오늘 컨디션이에요</h3>
        <p className="mt-1 text-sm text-atelier-text-soft">선생님이 오전에 확인한 내용이에요</p>

        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="rounded-2xl bg-atelier-surface-muted p-4 border border-atelier-border">
            <p className="text-xs font-medium text-atelier-text-soft">기분</p>
            <p className="mt-1.5 text-xl font-semibold text-atelier-title">{todayMood}</p>
          </div>
          <div className="rounded-2xl bg-atelier-surface-muted p-4 border border-atelier-border">
            <p className="text-xs font-medium text-atelier-text-soft">수면</p>
            <p className="mt-1.5 text-xl font-semibold text-atelier-title">{sleepHours}</p>
          </div>
          <div className="rounded-2xl bg-atelier-surface-muted p-4 border border-atelier-border">
            <p className="text-xs font-medium text-atelier-text-soft">스트레스</p>
            <p className="mt-1.5 text-xl font-semibold text-atelier-title">{stress || '기록 없음'}</p>
          </div>
          <div className="rounded-2xl bg-atelier-surface-muted p-4 border border-atelier-border">
            <p className="text-xs font-medium text-atelier-text-soft">피로</p>
            <p className="mt-1.5 text-xl font-semibold text-atelier-title">{fatigue}</p>
          </div>
          <div className="rounded-2xl bg-atelier-surface-muted p-4 border border-atelier-border">
            <p className="text-xs font-medium text-atelier-text-soft">집중</p>
            <p className="mt-1.5 text-xl font-semibold text-atelier-title">{focus}</p>
          </div>
        </div>
      </section>

      {/* ── 선생님 메시지 — letter-style single block ── */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-atelier-title">선생님이 전하는 이야기</h3>
        <p className="mt-1 text-sm text-atelier-text-soft">오늘 눈여겨본 부분을 알려드려요</p>

        {visibleNotes.length > 0 ? (
          <div className="mt-5 rounded-2xl bg-brand-primary-light/30 px-6 py-5">
            {visibleNotes.map((note, idx) => (
              <div key={note.id}>
                <p className="text-sm leading-relaxed text-atelier-text">{note.content}</p>
                {idx < visibleNotes.length - 1 && (
                  <hr className="my-3 border-brand-primary-light/50" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-atelier-text-soft">아직 전달할 내용이 없어요</p>
        )}
      </section>

      {/* ── 오늘의 추천 블렌드 — light card ── */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-atelier-title">오늘의 추천 블렌드</h3>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-brand-success/20 px-5 py-4 border border-brand-success/30">
          <span className="text-2xl">🍵</span>
          <div>
            <p className="text-base font-semibold text-atelier-text">{todayTea}</p>
            <p className="mt-0.5 text-sm text-atelier-text-soft">
              오늘 컨디션에 맞춰 선생님이 추천해 드린 블렌드예요
            </p>
          </div>
        </div>
      </section>

      {/* ── 최근 며칠간의 흐름 — compact ── */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-atelier-title">최근 며칠간의 흐름</h3>
        <p className="mt-1 text-sm text-atelier-text-soft">생활 리듬을 한눈에 볼 수 있어요</p>

        <div className="mt-4 space-y-0.5">
          {recentTrend.map((day) => (
            <div key={day.day} className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-atelier-surface-muted">
              <span className="w-11 shrink-0 text-xs font-semibold text-atelier-text-soft">{day.day}</span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${trendDotColor[day.status]}`} />
              <span className="text-xs text-atelier-text-muted">{day.parentSummary}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 응원하기 — consolidated ── */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-atelier-title">응원 한마디</h3>
          <span className="text-xs text-atelier-text-soft">
            이번 주 {child.encouragements.length}회 · 전체 {child.rewardCount}회
          </span>
        </div>
        <p className="mt-1 text-sm text-atelier-text-soft">따뜻한 말 한마디가 큰 힘이 돼요</p>

        {/* 기존 응원 기록 */}
        {child.encouragements.length > 0 ? (
          <div className="mt-4 space-y-1.5">
            {child.encouragements.map((enc, index) => (
              <div key={index} className="flex items-start justify-between rounded-xl bg-brand-error/10 px-4 py-2.5">
                <p className="text-sm text-atelier-text">{enc.message}</p>
                <span className="shrink-0 pl-3 text-xs text-brand-error">{enc.date}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* 단일 CTA 버튼 */}
        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-atelier-deep-green px-5 py-3.5 text-sm font-semibold text-atelier-surface shadow-sm transition hover:bg-atelier-deep-green/90"
        >
          응원 메시지 보내기
        </button>
      </section>
    </div>
  );
}