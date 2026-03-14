import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/common/StatusBadge';
import { AddMemberModal } from '../components/members/AddMemberModal';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizations } from '../hooks/useOrganizations';
import { addMember } from '../lib/firebase/writes';
import { useMembers } from '../hooks/useMembers';

export function MembersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Stable' | 'Attention' | 'Check'>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');
  const [organizationFilter, setOrganizationFilter] = useState<'all' | string>('all');
  const [testAccountOnly, setTestAccountOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { role, organizationId, status, canAccessOrg, isSuperAdmin } = useAuth();
  const { members, refetch } = useMembers({ role, organizationId, status });
  const { organizations } = useOrganizations();

  const scopedMembers = members.filter((member) => canAccessOrg(member.organizationId));
  const groups = Array.from(new Set(scopedMembers.map((member) => member.group)));
  const organizationOptions = Array.from(
    new Map(scopedMembers.map((member) => [member.organizationId, member.organizationName])).entries(),
  );
  const currentOrganizationName =
    organizations.find((organization) => organization.id === organizationId)?.name ?? '웰니스 데모 센터';

  const filteredMembers = scopedMembers.filter((member) => {
    const keyword = searchKeyword.trim().toLowerCase();
    const matchesKeyword =
      keyword.length === 0 ||
      member.name.toLowerCase().includes(keyword) ||
      member.group.toLowerCase().includes(keyword) ||
      member.organizationName.toLowerCase().includes(keyword) ||
      (member.parentConnection.guardianName ?? '').toLowerCase().includes(keyword) ||
      (member.testGroup ?? '').toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || member.group === groupFilter;
    const matchesOrganization = organizationFilter === 'all' || member.organizationId === organizationFilter;
    const matchesTestAccount = !testAccountOnly || member.isTestAccount;

    return matchesKeyword && matchesStatus && matchesGroup && matchesOrganization && matchesTestAccount;
  });

  const connectedCount = scopedMembers.filter((member) => member.parentConnection.connected).length;
  const actionNeededCount = scopedMembers.filter((member) => member.status !== 'Stable').length;
  const testerCount = scopedMembers.filter((member) => member.isTestAccount).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] bg-atelier-deep-green p-5 text-atelier-surface shadow-sm">
          <p className="text-sm text-atelier-surface-muted">전체 회원</p>
          <p className="mt-3 text-3xl font-semibold">{scopedMembers.length}</p>
          <p className="mt-2 text-sm text-brand-primary-light">
            {isSuperAdmin ? '전체 organization 기준' : `현재 organization: ${organizationId ?? '-'}`}
          </p>
        </div>
        <div className="rounded-[24px] bg-atelier-surface p-5 shadow-sm ring-1 ring-atelier-border">
          <p className="text-sm text-atelier-text-soft">가족 연결</p>
          <p className="mt-3 text-3xl font-semibold text-atelier-title">{connectedCount}</p>
          <p className="mt-2 text-sm text-atelier-text-soft">가족 홈 연동 가능</p>
        </div>
        <div className="rounded-[24px] bg-atelier-surface p-5 shadow-sm ring-1 ring-atelier-border">
          <p className="text-sm text-atelier-text-soft">확인 필요</p>
          <p className="mt-3 text-3xl font-semibold text-atelier-title">{actionNeededCount}</p>
          <p className="mt-2 text-sm text-atelier-text-soft">Attention · Check 상태 기준</p>
        </div>
        <div className="rounded-[24px] bg-atelier-surface p-5 shadow-sm ring-1 ring-atelier-border">
          <p className="text-sm text-atelier-text-soft">테스트 계정</p>
          <p className="mt-3 text-3xl font-semibold text-atelier-title">{testerCount}</p>
          <p className="mt-2 text-sm text-atelier-text-soft">isTestAccount === true</p>
        </div>
      </section>

      {/* 검색/필터 + 테이블 통합 */}
      <section className="rounded-[24px] border border-atelier-border bg-atelier-surface shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-atelier-border px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <input
            id="member-search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            className="w-full rounded-xl border border-atelier-border bg-brand-bg px-4 py-2.5 text-sm text-atelier-text outline-none transition placeholder:text-atelier-text-soft focus:border-atelier-deep-green sm:max-w-xs"
            placeholder="이름, 그룹, 조직, TEST 그룹 검색"
          />
          <select
            id="group-filter"
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
            className="rounded-xl border border-atelier-border bg-brand-bg px-4 py-2.5 text-sm text-atelier-text outline-none transition focus:border-atelier-deep-green"
          >
            <option value="all">전체 그룹</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'Stable' | 'Attention' | 'Check')}
            className="rounded-xl border border-atelier-border bg-brand-bg px-4 py-2.5 text-sm text-atelier-text outline-none transition focus:border-atelier-deep-green"
          >
            <option value="all">전체 상태</option>
            <option value="Stable">Stable</option>
            <option value="Attention">Attention</option>
            <option value="Check">Check</option>
          </select>
          <select
            id="organization-filter"
            value={organizationFilter}
            onChange={(event) => setOrganizationFilter(event.target.value)}
            disabled={!isSuperAdmin}
            className="rounded-xl border border-atelier-border bg-brand-bg px-4 py-2.5 text-sm text-atelier-text outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-atelier-deep-green"
          >
            <option value="all">전체 organization</option>
            {organizationOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 rounded-xl border border-atelier-border bg-brand-bg px-4 py-2.5 text-sm text-atelier-text">
            <input
              type="checkbox"
              checked={testAccountOnly}
              onChange={(event) => setTestAccountOnly(event.target.checked)}
              className="h-4 w-4 rounded border-atelier-border text-atelier-deep-green focus:ring-atelier-deep-green"
            />
            TEST 계정만 보기
          </label>
          <span className="ml-auto text-sm text-atelier-text-soft">{filteredMembers.length}명</span>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="shrink-0 rounded-xl bg-atelier-deep-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-atelier-deep-green/90"
          >
            + 회원 등록
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[1180px] grid-cols-[1.2fr_1fr_0.8fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_40px] gap-4 bg-atelier-surface-muted px-5 py-3 text-sm font-semibold text-atelier-text-soft">
            <span>이름</span>
            <span>organization</span>
            <span>그룹</span>
            <span>TEST</span>
            <span>가족</span>
            <span>최근 체크</span>
            <span>상태</span>
            <span>오늘의 블렌드</span>
            <span />
          </div>

          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="group grid min-w-[1180px] grid-cols-[1.2fr_1fr_0.8fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_40px] items-center gap-4 border-t border-atelier-border px-5 py-4 text-sm text-atelier-text transition-colors hover:bg-brand-primary-light/30"
            >
              <div>
                <p className="font-semibold text-atelier-title">{member.name}</p>
                <p className="text-xs text-atelier-text-soft">{member.room}</p>
              </div>
              <div>
                <span className="inline-flex rounded-full bg-atelier-chip px-3 py-1 text-xs font-semibold text-atelier-text">
                  {member.organizationName}
                </span>
              </div>
              <span>{member.group}</span>
              <div className="flex flex-wrap items-center gap-2">
                {member.isTestAccount ? (
                  <>
                    <span className="rounded-full bg-brand-error/10 px-2.5 py-1 text-xs font-semibold text-brand-error">TEST</span>
                    <span className="text-xs text-atelier-text-soft">{member.testGroup ?? '-'}</span>
                  </>
                ) : (
                  <span className="text-xs text-atelier-border-strong">일반</span>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 ${member.parentConnection.connected ? 'text-brand-success' : 'text-brand-error'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${member.parentConnection.connected ? 'bg-brand-success' : 'bg-brand-error'}`} />
                {member.parentConnection.connected ? '연결됨' : '연결 필요'}
              </span>
              <span>{member.lastCheckTime}</span>
              <div>
                <StatusBadge status={member.status} />
              </div>
              <span className="rounded-lg bg-brand-primary-light/50 px-2 py-0.5 font-medium text-brand-text">{member.todayRecommendedTea}</span>
              <span className="text-atelier-border-strong transition-transform group-hover:translate-x-0.5 group-hover:text-atelier-deep-green">→</span>
            </Link>
          ))}

          {filteredMembers.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-atelier-text-soft">조건에 맞는 회원이 없습니다. 검색어나 필터를 조정해 보세요.</div>
          ) : null}
        </div>
      </section>

      <AddMemberModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (form) => {
          try {
            await addMember({
              name: form.name,
              group: form.group,
              room: form.room,
              age: Number(form.age),
              organizationId: organizationId ?? 'org-demo-001',
              organizationName: currentOrganizationName,
              role: 'member',
              isTestAccount: false,
              testGroup: null,
              status: 'Stable',
              lastActiveAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              todayBlendName: form.todayRecommendedTea || '',
              todayBlendId: '',
              todayFocus: '',
              note: '',
              lastCheckTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
            });
            refetch();
            setIsAddModalOpen(false);
          } catch (err) {
            console.error('[AddMember] Firestore write failed:', err);
          }
        }}
      />

    </div>
  );
}