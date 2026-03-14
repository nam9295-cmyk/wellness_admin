import { Link } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { summaryCards as mockSummaryCards } from '../data/mockData';
import { useBlends } from '../hooks/useBlends';
import { useMembers } from '../hooks/useMembers';
import { getTodayDateString } from '../lib/date';

export function DashboardPage() {
  const { role, organizationId, status, canAccessOrg } = useAuth();
  const { members, isFirestore } = useMembers({ role, organizationId, status });
  const { blends, isFirestore: isBlendsFs } = useBlends();
  const visibleMembers = members.filter((member) => canAccessOrg(member.organizationId));

  // ── 대시보드 통계 (Firestore → mockData fallback) ──
  const totalCount = visibleMembers.length;
  const stableCount = visibleMembers.filter((m) => m.status === 'Stable').length;
  const attentionCount = visibleMembers.filter((m) => m.status === 'Attention').length;
  const checkCount = visibleMembers.filter((m) => m.status === 'Check').length;

  const todayStr = getTodayDateString();
  const todayCheckedCount = visibleMembers.filter((m) =>
    m.lastCheckTime?.startsWith(todayStr),
  ).length;
  const checkinPct = totalCount > 0 ? Math.round((todayCheckedCount / totalCount) * 100) : 0;

  const dashboardCards = isFirestore
    ? [
        { label: '전체 회원', value: String(totalCount), change: `Stable ${stableCount}명` },
        { label: '오늘 체크인', value: String(todayCheckedCount), change: `${checkinPct}% 완료` },
        { label: '확인 필요', value: String(attentionCount + checkCount), change: `Attention ${attentionCount} · Check ${checkCount}` },
        { label: '추천 블렌드', value: isBlendsFs ? `${blends.length}종` : '—', change: isBlendsFs ? '블렌드 카탈로그 연결됨' : '연결 준비 중' },
      ]
    : mockSummaryCards;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <div key={card.label} className="rounded-[24px] bg-atelier-deep-green p-5 text-atelier-surface shadow-sm">
            <p className="text-sm text-atelier-surface-muted">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-sm text-brand-primary-light">{card.change}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <PageSection title="오늘 회원 현황" description="체크인 기준, 주요 회원의 현재 상태입니다">
            <div className="space-y-3">
            {visibleMembers.map((member) => (
              <Link key={member.id} to={`/members/${member.id}`} className="group flex flex-col gap-3 rounded-2xl border border-atelier-border p-4 transition-colors hover:bg-brand-primary-light/30 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-atelier-title">{member.name}</p>
                  <p className="text-sm text-atelier-text-soft">
                    {member.group} · {member.room} · 가족 {member.parentConnection.guardianName ?? '미연결'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={member.status} />
                  <span className="text-sm text-atelier-text-soft">{member.lastCheckTime}</span>
                  <span className="text-atelier-border-strong transition-transform group-hover:translate-x-0.5 group-hover:text-atelier-deep-green">→</span>
                </div>
              </Link>
            ))}
          </div>
        </PageSection>

        <PageSection title="오늘의 메모" description="운영 중 참고할 사항을 모아두는 공간입니다">
          <div className="space-y-3 text-sm text-atelier-text">
            <div className="rounded-2xl bg-brand-primary-light/40 p-4">오전 체크인 미완료 회원 4명, 확인이 필요합니다</div>
            <div className="rounded-2xl bg-atelier-dusty-rose/40 p-4">혈압 재측정 대상 2명, 오후 라운딩에 포함 예정</div>
            <div className="rounded-2xl bg-atelier-chip p-4">가족 문의 5건 미확인, 가족 홈에서 응대 가능</div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
