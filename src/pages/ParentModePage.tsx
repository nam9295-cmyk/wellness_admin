import { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { parentChildViews } from '../data/mockData';

export function ParentModePage() {
  const [selectedChildId, setSelectedChildId] = useState(parentChildViews[0]?.childId ?? '');
  const child = parentChildViews.find((c) => c.childId === selectedChildId) ?? parentChildViews[0];

  if (!child) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">연결된 가족 정보가 없습니다</p>
        <p className="mt-2 text-sm text-slate-500">관리자에게 문의해 보호자 연결을 진행해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 자녀 선택 (복수 자녀 대응) */}
      {parentChildViews.length > 1 ? (
        <div className="flex items-center gap-3">
          {parentChildViews.map((c) => (
            <button
              key={c.childId}
              type="button"
              onClick={() => setSelectedChildId(c.childId)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
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

      {/* 오늘의 컨디션 요약 — 따뜻한 톤 */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-slate-900 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm text-teal-100">오늘의 우리 가족</p>
        <h3 className="mt-2 text-3xl font-semibold">{child.childName}님의 하루</h3>
        <p className="mt-3 text-sm text-slate-200">
          {child.todayChecked
            ? '오늘 체크인이 완료되었어요. 아래에서 자세한 상태를 확인해 보세요.'
            : '아직 오늘 체크인 전이에요. 곷 업데이트됩니다.'}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <StatusBadge status={child.status} />
          <span className="text-sm text-slate-200">마지막 확인: {child.lastCheckTime}</span>
        </div>
      </div>

      {/* 오늘 체크 상태 카드 */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">오늘 기분</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{child.todayMood}</p>
          <p className="mt-2 text-sm text-teal-600">컨디션 체크 기준</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">수면</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{child.sleepHours}</p>
          <p className="mt-2 text-sm text-teal-600">어젯밤 수면 시간</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">피로도</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{child.fatigue}</p>
          <p className="mt-2 text-sm text-teal-600">오전 기준</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">집중도</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{child.focus}</p>
          <p className="mt-2 text-sm text-teal-600">활동 참여 기준</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* 케어 포인트 — 부모가 읽기 편한 문장형 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">오늘 알려드리고 싶은 것</h3>
            <p className="mt-1 text-sm text-slate-500">담당 선생님이 전해드리는 케어 포인트예요</p>
          </div>
          <div className="space-y-3">
            {child.carePoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm text-teal-900">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 오늘의 추천 티 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">오늘의 추천 티</h3>
            <p className="mt-1 text-sm text-slate-500">컨디션에 맞춰 추천된 티예요</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-700 p-5 text-white">
            <p className="text-sm text-teal-100">Today&apos;s Tea</p>
            <p className="mt-2 text-2xl font-semibold">{child.todayTea}</p>
            <p className="mt-3 text-sm text-slate-100">
              오늘 상태 흐름에 맞춰 선생님이 추천해 드린 티예요.
            </p>
          </div>
        </div>
      </div>

      {/* 최근 흐름 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-900">최근 며칠간의 흐름</h3>
          <p className="mt-1 text-sm text-slate-500">최근 생활 리듬을 한눈에 확인하실 수 있어요</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          {child.recentTrend.map((day) => (
            <div key={day.day} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-900">{day.day}</p>
                <p className="mt-1 text-sm text-slate-500">{day.summary}</p>
              </div>
              <StatusBadge status={day.status} />
            </div>
          ))}
        </div>
      </div>

      {/* 응원 / 보상 영역 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">응원 보내기</h3>
            <p className="mt-1 text-sm text-slate-500">따뜻한 한마디가 큰 힘이 됩니다</p>
          </div>

          {child.encouragements.length > 0 ? (
            <div className="mb-4 space-y-3">
              {child.encouragements.map((enc, index) => (
                <div key={index} className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm text-amber-900">{enc.message}</p>
                  <p className="mt-1 text-xs text-amber-600">{enc.date}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              className="rounded-2xl bg-teal-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              응원 메시지 보내기
            </button>
            <button
              type="button"
              className="rounded-2xl bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              감사 인사 전하기
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">응원 기록</h3>
            <p className="mt-1 text-sm text-slate-500">지금까지 보내신 응원의 기록이에요</p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 text-center text-white">
            <p className="text-sm text-slate-300">누적 응원</p>
            <p className="mt-2 text-4xl font-semibold">{child.rewardCount}</p>
            <p className="mt-3 text-sm text-teal-300">보내주시는 응원이 큰 힘이 돼요</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center text-sm text-emerald-800">
              <p className="text-lg font-semibold">{child.encouragements.length}</p>
              <p className="mt-1">이번 주</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4 text-center text-sm text-sky-800">
              <p className="text-lg font-semibold">{child.rewardCount}</p>
              <p className="mt-1">전체</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-800">
              <p className="text-lg font-semibold">연속 3일</p>
              <p className="mt-1">연속 응원</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
