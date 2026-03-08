import { useState } from 'react';
import { ParentStatusLabel } from '../components/common/ParentStatusLabel';
import { careNotes, parentChildViews } from '../data/mockData';
import type { MemberStatus } from '../types/member';

const trendDotColor: Record<MemberStatus, string> = {
  Stable: 'bg-emerald-400',
  Attention: 'bg-amber-400',
  Check: 'bg-sky-400',
};

export function ParentModePage() {
  const [selectedChildId, setSelectedChildId] = useState(parentChildViews[0]?.childId ?? '');
  const child = parentChildViews.find((c) => c.childId === selectedChildId) ?? parentChildViews[0];

  if (!child) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">연결된 가족 정보가 없어요</p>
        <p className="mt-2 text-sm text-slate-500">관리자에게 문의해 보호자 연결을 진행해 주세요.</p>
      </div>
    );
  }

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

      {/* ── 인사 영역 ── */}
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
        <div className="mt-5">
          <ParentStatusLabel status={child.status} />
        </div>
      </section>

      {/* ── 오늘 컨디션 요약 ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">오늘 컨디션이에요</h3>
        <p className="mt-1 text-sm text-slate-500">선생님이 오전에 확인한 내용이에요</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">기분</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{child.todayMood}</p>
            <p className="mt-1 text-xs text-slate-400">오전 체크 기준</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">수면</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{child.sleepHours}</p>
            <p className="mt-1 text-xs text-slate-400">어젯밤 기준</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">피로</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{child.fatigue}</p>
            <p className="mt-1 text-xs text-slate-400">오전 활동 기준</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">집중</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{child.focus}</p>
            <p className="mt-1 text-xs text-slate-400">활동 참여 기준</p>
          </div>
        </div>
      </section>

      {/* ── 선생님 메시지 (케어 포인트 — parent_visible만) ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">선생님이 전하는 이야기</h3>
        <p className="mt-1 text-sm text-slate-500">오늘 눈여겨본 부분을 알려드려요</p>

        <div className="mt-5 space-y-3">
          {careNotes
            .filter((n) => n.memberId === child.childId && n.visibility === 'parent_visible')
            .map((note) => (
              <div key={note.id} className="rounded-2xl bg-teal-50/70 px-5 py-4">
                <p className="text-sm leading-relaxed text-teal-900">{note.content}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ── 오늘의 추천 티 ── */}
      <section className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-700 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-teal-100">오늘의 추천 티</p>
        <p className="mt-3 text-2xl font-semibold">{child.todayTea}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          오늘 컨디션에 맞춰 선생님이 추천해 드린 티예요. 편안한 하루를 보내시길 바라요.
        </p>
      </section>

      {/* ── 최근 며칠간의 흐름 ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">최근 며칠간의 흐름</h3>
        <p className="mt-1 text-sm text-slate-500">생활 리듬을 한눈에 볼 수 있어요</p>

        <div className="mt-5 space-y-2">
          {child.recentTrend.map((day) => (
            <div key={day.day} className="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-slate-50">
              <span className="w-12 shrink-0 text-sm font-semibold text-slate-700">{day.day}</span>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${trendDotColor[day.status]}`} />
              <span className="text-sm text-slate-600">{day.parentSummary}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 응원하기 ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">응원 한마디</h3>
        <p className="mt-1 text-sm text-slate-500">따뜻한 말 한마디가 큰 힘이 돼요</p>

        {/* 기존 응원 기록 */}
        {child.encouragements.length > 0 ? (
          <div className="mt-5 space-y-2">
            {child.encouragements.map((enc, index) => (
              <div key={index} className="flex items-start justify-between rounded-2xl bg-amber-50/70 px-5 py-3">
                <p className="text-sm text-amber-900">{enc.message}</p>
                <span className="shrink-0 pl-4 text-xs text-amber-500">{enc.date}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* 액션 버튼 */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-2xl bg-teal-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            응원 메시지 보내기
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            감사 인사 전하기
          </button>
        </div>

        {/* 응원 요약 */}
        <div className="mt-5 flex items-center justify-center gap-6 rounded-2xl bg-slate-50 px-5 py-4">
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900">{child.encouragements.length}</p>
            <p className="mt-0.5 text-xs text-slate-500">이번 주</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900">{child.rewardCount}</p>
            <p className="mt-0.5 text-xs text-slate-500">전체 응원</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xl font-semibold text-teal-700">연속 3일</p>
            <p className="mt-0.5 text-xs text-slate-500">응원 중</p>
          </div>
        </div>
      </section>
    </div>
  );
}
