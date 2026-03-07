import { Link } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { members } from '../data/mockData';

export function MembersPage() {
  return (
    <div className="space-y-6">
      <PageSection title="회원 목록" description="검색/필터 자리와 함께 관리자용 회원 흐름을 먼저 잡아두는 화면">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_0.9fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</p>
            <p className="mt-2 text-sm text-slate-400">이름, 반, 보호자명 검색 영역</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Group Filter</p>
            <p className="mt-2 text-sm text-slate-400">반/그룹 선택 필터 자리</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-2 text-sm text-slate-400">상태 필터 자리</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Parent Link</p>
            <p className="mt-2 text-sm text-slate-400">연결 여부 필터 자리</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="회원 리스트" description="클릭 한 번으로 상세 페이지로 이어지는 관리자용 목록 구조">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-[1.1fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr] gap-4 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
            <span>이름</span>
            <span>그룹/반</span>
            <span>보호자 연결</span>
            <span>최근 체크</span>
            <span>상태</span>
            <span>오늘 추천 티</span>
            <span>이동</span>
          </div>

          {members.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="grid grid-cols-[1.1fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr] items-center gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.room}</p>
              </div>
              <span>{member.group}</span>
              <span className={member.parentConnection.connected ? 'text-emerald-700' : 'text-amber-700'}>
                {member.parentConnection.connected ? '연결됨' : '연결 필요'}
              </span>
              <span>{member.lastCheckTime}</span>
              <div>
                <StatusBadge status={member.status} />
              </div>
              <span className="font-medium text-slate-900">{member.todayRecommendedTea}</span>
              <span className="font-semibold text-teal-700">상세 보기</span>
            </Link>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
