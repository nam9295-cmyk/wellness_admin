import { useState } from 'react';
import { ParentStatusLabel } from '../components/common/ParentStatusLabel';
import { careNotes, parentChildViews } from '../data/mockData';
import type { MemberStatus } from '../types/member';

const trendDotColor: Record<MemberStatus, string> = {
  Stable: 'bg-emerald-400',
  Attention: 'bg-amber-400',
  Check: 'bg-sky-400',
};

const heroOneLiner: Record<MemberStatus, string> = {
  Stable: '오늘은 편안한 하루를 보내고 계세요',
  Attention: '오늘 조금 더 살펴보는 부분이 있어요',
  Check: '선생님이 꼼꼼히 확인하고 있어요',
};

export function ParentModePage() {
  const [selectedChildId, setSelectedChildId] = useState(parentChildViews[0]?.childId ?? '');
  const child = parentChildViews.find((c) => c.childId === selectedChildId) ?? parentChildViews[0];

  if (!child) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">연결된 가족 정보가 없어요</p>
        <p className="mt-2 text-sm text-slate-500">관리자에게 문의해 가족 연결을 진행해 주세요.</p>
      </div>
    );
  }

  const visibleNotes = careNotes.filter(
    (n) => n.memberId === child.childId && n.visibility === 'parent_visible',
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* 자녀 선택 */}
      {parentChildViews.length > 1 ? (
        <div className="flex items-center gap-3">
          {parentChildViews.map((c) => (
            <button
              key={c.childId}
              type="button"
              onClick={() => setSelectedChildId(c.childId)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                c.childId === selectedChildId
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.childName}
            </button>
          ))}
        </div>
      ) : null}

      {/* ── 인사 영역 + 오늘의 한마디 ── */}
      <section className="rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium text-teal-100">
          {child.todayChecked ? '오늘 체크인 완료' : '체크인 대기 중'}
        </p>
        <h2 className="mt-2 text-3xl font-semibold">{child.childName}님, 오늘도 좋은 하루예요</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          {child.todayChecked
            ? '오늘 컨디션 확인이 끝났어요. 아래에서 자세히 살펴보실 수 있어요.'
            : '아직 오늘 체크인 전이에요. 곧 업데이트될 거예요.'}
        </p>

        {/* 오늘의 한마디 pill */}
        <div className="mt-5 flex items-center gap-3">
          <ParentStatusLabel status={child.status} />
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {heroOneLiner[child.status]}
          </span>
        </div>
      </section>

      {/* ── 오늘 컨디션 요약 (sub-label 제거) ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">오늘 컨디션이에요</h3>
        <p className="mt-1 text-sm text-slate-500">선생님이 오전에 확인한 내용이에요</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">기분</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{child.todayMood}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">수면</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{child.sleepHours}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">피로</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{child.fatigue}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">집중</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{child.focus}</p>
          </div>
        </div>
      </section>

      {/* ── 선생님 메시지 — letter-style single block ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">선생님이 전하는 이야기</h3>
        <p className="mt-1 text-sm text-slate-500">오늘 눈여겨본 부분을 알려드려요</p>

        {visibleNotes.length > 0 ? (
          <div className="mt-5 rounded-2xl bg-teal-50/60 px-6 py-5">
            {visibleNotes.map((note, idx) => (
              <div key={note.id}>
                <p className="text-sm leading-relaxed text-teal-900">{note.content}</p>
                {idx < visibleNotes.length - 1 && (
                  <hr className="my-3 border-teal-200/60" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">아직 전달할 내용이 없어요</p>
        )}
      </section>

      {/* ── 오늘의 추천 블렌드 — light card ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">오늘의 추천 블렌드</h3>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-emerald-50/70 px-5 py-4">
          <span className="text-2xl">🍵</span>
          <div>
            <p className="text-base font-semibold text-emerald-900">{child.todayTea}</p>
            <p className="mt-0.5 text-sm text-emerald-700/80">
              오늘 컨디션에 맞춰 선생님이 추천해 드린 블렌드예요
            </p>
          </div>
        </div>
      </section>

      {/* ── 최근 며칠간의 흐름 — compact ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">최근 며칠간의 흐름</h3>
        <p className="mt-1 text-sm text-slate-500">생활 리듬을 한눈에 볼 수 있어요</p>

        <div className="mt-4 space-y-0.5">
          {child.recentTrend.map((day) => (
            <div key={day.day} className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50">
              <span className="w-11 shrink-0 text-xs font-semibold text-slate-500">{day.day}</span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${trendDotColor[day.status]}`} />
              <span className="text-xs text-slate-600">{day.parentSummary}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 응원하기 — consolidated ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-900">응원 한마디</h3>
          <span className="text-xs text-slate-400">
            이번 주 {child.encouragements.length}회 · 전체 {child.rewardCount}회
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">따뜻한 말 한마디가 큰 힘이 돼요</p>

        {/* 기존 응원 기록 */}
        {child.encouragements.length > 0 ? (
          <div className="mt-4 space-y-1.5">
            {child.encouragements.map((enc, index) => (
              <div key={index} className="flex items-start justify-between rounded-xl bg-amber-50/70 px-4 py-2.5">
                <p className="text-sm text-amber-900">{enc.message}</p>
                <span className="shrink-0 pl-3 text-xs text-amber-500">{enc.date}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* 단일 CTA 버튼 */}
        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          응원 메시지 보내기
        </button>
      </section>
    </div>
  );
}
