import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { members } from '../data/mockData';

export function MembersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Stable' | 'Attention' | 'Check'>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');

  const groups = Array.from(new Set(members.map((member) => member.group)));
  const filteredMembers = members.filter((member) => {
    const keyword = searchKeyword.trim().toLowerCase();
    const matchesKeyword =
      keyword.length === 0 ||
      member.name.toLowerCase().includes(keyword) ||
      member.group.toLowerCase().includes(keyword) ||
      (member.parentConnection.guardianName ?? '').toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || member.group === groupFilter;

    return matchesKeyword && matchesStatus && matchesGroup;
  });

  const connectedCount = members.filter((member) => member.parentConnection.connected).length;
  const actionNeededCount = members.filter((member) => member.status !== 'Stable').length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
          <p className="text-sm text-slate-300">전체 회원</p>
          <p className="mt-3 text-3xl font-semibold">{members.length}</p>
          <p className="mt-2 text-sm text-teal-300">현재 케어 대상 기준</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">보호자 연결</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{connectedCount}</p>
          <p className="mt-2 text-sm text-slate-500">보호자 홈 연동 가능</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">확인 필요</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{actionNeededCount}</p>
          <p className="mt-2 text-sm text-slate-500">Attention · Check 상태 기준</p>
        </div>
      </section>

      <PageSection title="회원 목록" description="검색과 필터로 회원을 빠르게 찾을 수 있습니다">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="member-search">
              검색
            </label>
            <input
              id="member-search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500"
              placeholder="이름, 그룹, 보호자 이름으로 검색"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="group-filter">
              그룹
            </label>
            <select
              id="group-filter"
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
            >
              <option value="all">전체 그룹</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="status-filter">
              상태
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | 'Stable' | 'Attention' | 'Check')}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
            >
              <option value="all">전체 상태</option>
              <option value="Stable">Stable</option>
              <option value="Attention">Attention</option>
              <option value="Check">Check</option>
            </select>
          </div>
        </div>
      </PageSection>

      <PageSection title="회원 리스트" description="회원을 선택하면 상세 화면으로 이동합니다">
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span>{filteredMembers.length}명 표시 중</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <div className="grid min-w-[980px] grid-cols-[1.1fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_0.9fr] gap-4 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
            <span>이름</span>
            <span>그룹</span>
            <span>보호자</span>
            <span>최근 체크</span>
            <span>상태</span>
            <span>오늘의 티</span>
            <span>오늘 포커스</span>
          </div>

          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="grid min-w-[980px] grid-cols-[1.1fr_0.9fr_0.8fr_1fr_0.8fr_0.9fr_0.9fr] items-center gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700 transition hover:bg-teal-50/40"
            >
              <div>
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.room}</p>
              </div>
              <span>{member.group}</span>
              <span className={`inline-flex items-center gap-1.5 ${member.parentConnection.connected ? 'text-emerald-700' : 'text-amber-700'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${member.parentConnection.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {member.parentConnection.connected ? '연결됨' : '연결 필요'}
              </span>
              <span>{member.lastCheckTime}</span>
              <div>
                <StatusBadge status={member.status} />
              </div>
              <span className="rounded-lg bg-teal-50 px-2 py-0.5 font-medium text-teal-800">{member.todayRecommendedTea}</span>
              <span>{member.todayFocus}</span>
            </Link>
          ))}

          {filteredMembers.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">조건에 맞는 회원이 없습니다. 검색어나 필터를 조정해 보세요.</div>
          ) : null}
        </div>
      </PageSection>
    </div>
  );
}
