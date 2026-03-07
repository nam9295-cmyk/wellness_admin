import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { members, summaryCards } from '../data/mockData';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
            <p className="text-sm text-slate-300">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-sm text-teal-300">{card.change}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <PageSection title="실시간 회원 상태" description="더미 데이터 기준 주요 회원 상태 요약">
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-500">
                    {member.group} · {member.room} · 보호자 {member.parentConnection.guardianName ?? '미연결'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={member.status} />
                  <span className="text-sm text-slate-500">{member.lastCheckTime}</span>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="오늘의 메모" description="추후 공지/업무 메모 카드로 확장할 수 있는 자리">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-teal-50 p-4">오전 체크인 마감 전 미완료 회원 4명 확인 필요</div>
            <div className="rounded-2xl bg-amber-50 p-4">혈압 재측정 대상 2명, 오후 라운딩에 포함 예정</div>
            <div className="rounded-2xl bg-slate-100 p-4">보호자 문의 5건 미확인, Parent Mode 페이지에서 대응 가능</div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
