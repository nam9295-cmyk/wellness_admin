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
      <div className="flex items-center justify-between">
        <div>
          <Link to="/members" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
            회원 목록으로 돌아가기
          </Link>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{member.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {member.group} · {member.room} · {member.age}세
          </p>
        </div>
        <StatusBadge status={member.status} />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
          <p className="text-sm text-slate-300">오늘 운영 포커스</p>
          <p className="mt-3 text-2xl font-semibold">{member.todayFocus}</p>
          <p className="mt-2 text-sm text-teal-300">담당자가 우선 확인할 핵심 포인트</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">보호자 연결 상태</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{member.parentConnection.connected ? '연결 완료' : '연결 필요'}</p>
          <p className="mt-2 text-sm text-slate-500">{member.parentConnection.channel}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">다음 공유 예정</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{member.parentConnection.nextShareNote}</p>
        </div>
      </section>

      <PageSection title="기본 정보" description="관리자가 가장 먼저 확인하는 핵심 카드">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">이름</p>
            <p className="mt-2 text-xl font-semibold">{member.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">그룹/반</p>
            <p className="mt-2 text-xl font-semibold">{member.group}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">보호자</p>
            <p className="mt-2 text-xl font-semibold">{member.parentConnection.guardianName ?? '미연결'}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">최근 체크</p>
            <p className="mt-2 text-xl font-semibold">{member.lastCheckTime}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">현재 상태</p>
            <div className="mt-3">
              <StatusBadge status={member.status} />
            </div>
          </div>
        </div>
      </PageSection>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PageSection title="최근 7일 상태 요약" description="주간 흐름을 보고 상세 케어 판단을 할 수 있는 영역">
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

        <PageSection title="보호자 연결 정보" description="보호자 모드와 이어질 연결 상태를 미리 보여주는 영역">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-100 p-4">
              연결 상태: <span className="font-semibold text-slate-900">{member.parentConnection.connected ? '연결됨' : '연결 필요'}</span>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              보호자 정보: <span className="font-semibold text-slate-900">{member.parentConnection.guardianName ?? member.parentConnection.relationship}</span>
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

      <PageSection title="웰니스 흐름 카드" description="수면/기분/피로/집중 흐름을 카드형으로 보는 구조">
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <PageSection title="오늘 추천 티" description="회원 상태와 자연스럽게 연결되는 추천 영역">
          <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-slate-900 p-6 text-white">
            <p className="text-sm text-teal-100">Today Recommended Tea</p>
            <p className="mt-3 text-3xl font-semibold">{member.todayRecommendedTea}</p>
            <p className="mt-3 text-sm text-slate-200">상태 흐름과 컨디션 메모를 보고 추천이 들어갈 자리입니다.</p>
          </div>
        </PageSection>

        <PageSection title="케어 포인트 / 관리자 메모" description="운영자 관점에서 다음 액션으로 이어지는 영역">
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">{member.carePoint}</div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">{member.note}</div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">건강 체크 기록 보기</div>
              <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">보호자 공유 브리핑 작성</div>
              <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">후속 메모 등록</div>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
