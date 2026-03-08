import { Link, useParams } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { members } from '../data/mockData';

export function MemberDetailPage() {
  const { memberId } = useParams();
  const member = members.find((item) => item.id === memberId);

  if (!member) {
    return (
      <PageSection title="회원 정보를 찾을 수 없습니다">
        <Link to="/members" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
          목록으로 돌아가기
        </Link>
      </PageSection>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 + 기본 정보 카드 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Link to="/members" className="inline-block text-sm font-semibold text-teal-700 hover:text-teal-800">
          ← 회원 목록
        </Link>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-slate-900">{member.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {member.group} · {member.room} · {member.age}세
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                보호자: <span className="font-semibold text-slate-900">{member.parentConnection.guardianName ?? '미연결'}</span>
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                최근 체크: <span className="font-semibold text-slate-900">{member.lastCheckTime}</span>
              </span>
            </div>
          </div>
          <StatusBadge status={member.status} />
        </div>
      </div>

      {/* 오늘 운영 포커스 + 보호자 연결 + 다음 공유 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
          <p className="text-sm text-slate-300">오늘 포커스</p>
          <p className="mt-3 text-2xl font-semibold">{member.todayFocus}</p>
          <p className="mt-2 text-sm text-teal-300">담당자 우선 확인 포인트</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">보호자 연결</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {member.parentConnection.connected ? '연결 완료' : '연결 필요'}
          </p>
          <p className="mt-2 text-sm text-slate-500">{member.parentConnection.channel}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">다음 공유 예정</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{member.parentConnection.nextShareNote}</p>
        </div>
      </section>

      {/* 최근 7일 요약 + 보호자 연결 정보 */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PageSection title="최근 7일 흐름" description="주간 상태 변화를 한눈에 확인할 수 있습니다">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {member.weeklyStatus.map((item) => (
              <div key={item.day} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.day}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.summary}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="보호자 연결 정보" description="보호자 홈과 연동되는 공유 상태입니다">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-100 p-4">
              연결 상태:{' '}
              <span className="font-semibold text-slate-900">
                {member.parentConnection.connected ? '연결됨' : '연결 필요'}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              보호자:{' '}
              <span className="font-semibold text-slate-900">
                {member.parentConnection.guardianName ?? member.parentConnection.relationship}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              최근 공유: <span className="font-semibold text-slate-900">{member.parentConnection.lastSharedAt}</span>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              공유 채널: <span className="font-semibold">{member.parentConnection.channel}</span>
            </div>
            <div className="rounded-2xl bg-teal-50 p-4 text-teal-900">
              전달 예정 메모: <span className="font-semibold">{member.parentConnection.nextShareNote}</span>
            </div>
          </div>
        </PageSection>
      </div>

      {/* 수면 / 기분 / 피로 / 집중 흐름 카드 */}
      <PageSection title="웰니스 흐름" description="수면 · 기분 · 피로 · 집중 — 오늘 기준">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {member.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
              <p className="mt-2 text-sm font-medium text-teal-700">{metric.trend}</p>
              <p className="mt-3 text-sm text-slate-500">{metric.note}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* 추천 티 + 저장한 티 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PageSection title="오늘의 추천 티" description="상태 흐름 기반 추천입니다">
          <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-slate-900 p-6 text-white">
            <p className="text-sm text-teal-100">Today's Tea</p>
            <p className="mt-3 text-3xl font-semibold">{member.todayRecommendedTea}</p>
            <p className="mt-3 text-sm text-slate-200">
              오늘 상태 흐름에 맞춘 추천입니다
            </p>
          </div>
        </PageSection>

        <PageSection title="저장한 티" description="이 회원이 선호하거나 효과를 느낌 티 목록">
          {member.savedTeas.length > 0 ? (
            <div className="space-y-3">
              {member.savedTeas.map((tea) => (
                <div key={tea.name} className="flex items-start justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{tea.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{tea.reason}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    {tea.savedAt}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              아직 저장한 티가 없습니다.
            </div>
          )}
        </PageSection>
      </div>

      {/* 케어 포인트 / 관리자 메모 */}
      <PageSection title="케어 포인트" description="다음 케어 액션으로 이어지는 영역입니다">
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">{member.carePoint}</div>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            {member.note}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">건강 체크 기록</div>
            <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">보호자 브리핑 작성</div>
            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">메모 추가</div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
