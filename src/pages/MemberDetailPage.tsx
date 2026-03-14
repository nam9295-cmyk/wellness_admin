import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useConditionNotes } from '../hooks/useConditionNotes';
import { useDailySummaries } from '../hooks/useDailySummaries';
import { useBlends } from '../hooks/useBlends';
import { useMember } from '../hooks/useMembers';
import { useSavedTeas } from '../hooks/useSavedTeas';
import { formatDailySummaryValue } from '../lib/dailySummaryDisplay';
import type { CareNote, WellnessMetric } from '../types/member';

const METRIC_CONFIG: Array<{ label: WellnessMetric['label']; key: 'sleep' | 'mood' | 'stress' | 'fatigue' | 'focus' }> = [
  { label: '수면', key: 'sleep' },
  { label: '기분', key: 'mood' },
  { label: '스트레스', key: 'stress' },
  { label: '피로', key: 'fatigue' },
  { label: '집중', key: 'focus' },
];

export function MemberDetailPage() {
  const { memberId } = useParams();
  const { role, organizationId, status, canAccessOrg } = useAuth();
  const { notes: firestoreNotes, isFirestore: isNotesFirestore } = useConditionNotes(memberId);
  const { summaries } = useDailySummaries(memberId, 7);
  const [localCareNotes, setLocalCareNotes] = useState<CareNote[]>([]);
  const [noteFilter, setNoteFilter] = useState<'all' | 'admin_only' | 'parent_visible'>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const resolvedNotes = isNotesFirestore ? firestoreNotes : [];
  const latestSummary = summaries[0] ?? null;
  const metricCards = METRIC_CONFIG.map(({ label, key }) => ({
    label,
    value: formatDailySummaryValue(key, latestSummary?.[key]),
    trend: latestSummary ? `${latestSummary.date} 기준` : '요약 데이터 없음',
    note: latestSummary?.adminSummary || 'dailySummaries 연결 후 이 영역에 최신 요약이 표시됩니다.',
  }));
  const weeklyStatus = summaries.map((summary) => ({
    day: summary.date.slice(5),
    status: summary.status,
    summary: summary.adminSummary || summary.parentSummary || '요약 없음',
    parentSummary: summary.parentSummary,
  }));

  // Firestore / mockData 노트가 로드되면 로컬 상태에 동기화
  useEffect(() => {
    setLocalCareNotes(resolvedNotes);
  }, [resolvedNotes]);

  const { member, error: memberError } = useMember(memberId, { role, organizationId, status });

  const { blends, isFirestore: isBlendsFirestore } = useBlends();
  const { savedTeas, loading: savedTeasLoading } = useSavedTeas(memberId);

  // Firestore teas 카탈로그 매칭 (3단계 우선순위)
  // 1순위: teaId(문서 ID) 매칭 — 가장 안정적
  // 2순위: 이름 문자열 매칭 — fallback
  // 3순위: mockData 원본 문자열 — 최종 fallback
  const matchedById = member?.todayTeaId && isBlendsFirestore
    ? blends.find((b) => b.id === member.todayTeaId)
    : null;
  const matchedByName = !matchedById && isBlendsFirestore
    ? blends.find((b) => b.name === member?.todayRecommendedTea || b.nameKo === member?.todayRecommendedTea)
    : null;
  const matchedBlend = matchedById ?? matchedByName;
  const todayBlendName = matchedBlend?.nameKo ?? matchedBlend?.name ?? member?.todayRecommendedTea ?? '';
  const savedTeaCards = savedTeas.map((savedTea) => {
    const savedBlend = savedTea.teaId
      ? blends.find((blend) => blend.id === savedTea.teaId)
      : null;
    return {
      id: savedTea.id,
      name:
        savedBlend?.nameKo ??
        savedBlend?.name ??
        savedTea.displayName ??
        savedTea.teaId ??
        savedTea.catalogId ??
        '저장한 블렌드',
      reason: savedTea.summary || savedTea.reason,
      typeLabel:
        savedTea.type === 'cwater'
          ? 'C.WATER'
          : savedTea.type === 'custom'
            ? 'CUSTOM'
            : 'LEGACY',
      meta:
        savedTea.type === 'cwater'
          ? savedTea.tags.slice(0, 3).join(' · ') || savedTea.detail
          : savedTea.type === 'custom'
            ? savedTea.tags.slice(0, 3).join(' · ') || savedTea.detail
            : '',
      savedAt: savedTea.savedAt,
    };
  });

  if (memberError?.includes('권한')) {
    return (
      <PageSection title="접근 권한이 없습니다" description="현재 로그인 역할로는 이 organization의 회원을 볼 수 없습니다.">
        <Link to="/members" className="text-sm font-semibold text-atelier-deep-green hover:text-atelier-deep-green/80">
          회원 목록으로 돌아가기
        </Link>
      </PageSection>
    );
  }

  if (!member) {
    return (
      <PageSection title="회원 정보를 찾을 수 없습니다">
        <Link to="/members" className="text-sm font-semibold text-atelier-deep-green hover:text-atelier-deep-green/80">
          목록으로 돌아가기
        </Link>
      </PageSection>
    );
  }

  if (!canAccessOrg(member.organizationId)) {
    return (
      <PageSection title="접근 권한이 없습니다" description="현재 로그인 역할로는 이 organization의 회원을 볼 수 없습니다.">
        <Link to="/members" className="text-sm font-semibold text-atelier-deep-green hover:text-atelier-deep-green/80">
          회원 목록으로 돌아가기
        </Link>
      </PageSection>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 + 기본 정보 카드 */}
      <div className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
        <Link to="/members" className="inline-block text-sm font-semibold text-atelier-deep-green hover:text-atelier-deep-green/80">
          ← 회원 목록
        </Link>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-atelier-title">{member.name}</h3>
            <p className="mt-1 text-sm text-atelier-text-soft">
              {member.group} · {member.room} · {member.age}세
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-atelier-text-muted">
              <span className="rounded-lg bg-atelier-surface-muted px-3 py-1">
                organization: <span className="font-semibold text-atelier-title">{member.organizationName}</span>
              </span>
              <span className="rounded-lg bg-atelier-surface-muted px-3 py-1">
                가족: <span className="font-semibold text-atelier-title">{member.parentConnection.guardianName ?? '미연결'}</span>
              </span>
              <span className="rounded-lg bg-atelier-surface-muted px-3 py-1">
                최근 체크: <span className="font-semibold text-atelier-title">{member.lastCheckTime}</span>
              </span>
            </div>
          </div>
          <StatusBadge status={member.status} />
        </div>
      </div>

      {/* 오늘 운영 포커스 + 가족 연결 + 다음 공유 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-atelier-deep-green p-5 text-atelier-surface shadow-sm">
          <p className="text-sm text-atelier-surface-muted">오늘 포커스</p>
          <p className="mt-3 text-2xl font-semibold">{member.todayFocus}</p>
          <p className="mt-2 text-sm text-brand-primary-light">담당자 우선 확인 포인트</p>
        </div>
        <div className="rounded-[24px] bg-atelier-surface p-5 shadow-sm ring-1 ring-atelier-border">
          <p className="text-sm text-atelier-text-soft">가족 연결</p>
          <p className="mt-3 text-2xl font-semibold text-atelier-title">
            {member.parentConnection.connected ? '연결 완료' : '연결 필요'}
          </p>
          <p className="mt-2 text-sm text-atelier-text-soft">{member.parentConnection.channel}</p>
        </div>
        <div className="rounded-[24px] bg-atelier-surface p-5 shadow-sm ring-1 ring-atelier-border">
          <p className="text-sm text-atelier-text-soft">다음 공유 예정</p>
          <p className="mt-3 text-lg font-semibold text-atelier-title">
            {member.parentConnection.nextShareNote || '보호자 공유 데이터 연결 전'}
          </p>
        </div>
      </section>

      {/* 수면 / 기분 / 스트레스 / 피로 / 집중 흐름 카드 */}
      <PageSection title="웰니스 흐름" description="수면 · 기분 · 스트레스 · 피로 · 집중 — 오늘 기준">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metricCards.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-atelier-border bg-atelier-surface-muted p-5">
              <p className="text-sm text-atelier-text-soft">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-atelier-title">{metric.value}</p>
              <p className="mt-2 text-sm font-medium text-brand-primary-light">{metric.trend}</p>
              <p className="mt-3 text-sm text-atelier-text-muted">{metric.note}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* 최근 7일 흐름 — 풀 와이드 */}
      <PageSection title="최근 7일 흐름" description="주간 상태 변화를 한눈에 확인할 수 있습니다">
        {weeklyStatus.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {weeklyStatus.map((item) => (
              <div key={item.day} className="flex items-center justify-between rounded-2xl border border-atelier-border p-4">
                <div>
                  <p className="font-semibold text-atelier-title">{item.day}</p>
                  <p className="mt-1 text-sm text-atelier-text-soft">{item.summary}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-atelier-surface-muted p-5 text-center text-sm text-atelier-text-soft">
            최근 7일 요약 데이터가 없습니다. `dailySummaries`가 연결되면 이곳에 표시됩니다.
          </div>
        )}
      </PageSection>

      {/* 추천 블렌드 + 저장한 블렌드 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PageSection title="오늘의 추천 블렌드" description="상태 흐름 기반 추천입니다">
          <div className="rounded-[28px] bg-gradient-to-br from-atelier-deep-green to-atelier-cocoa-strong p-6 text-white">
            <p className="text-sm text-brand-primary-light">Today's Blend</p>
            <p className="mt-3 text-3xl font-semibold">{todayBlendName}</p>
            <p className="mt-3 text-sm text-white/80">
              오늘 상태 흐름에 맞춘 추천입니다
            </p>
          </div>
        </PageSection>

        <PageSection title="저장한 블렌드" description="이 회원이 선호하거나 효과를 느낌 블렌드 목록">
          {savedTeasLoading ? (
            <div className="rounded-2xl bg-atelier-surface-muted p-5 text-center text-sm text-atelier-text-soft">
              저장된 블렌드를 불러오는 중입니다.
            </div>
          ) : savedTeaCards.length > 0 ? (
            <div className="space-y-3">
              {savedTeaCards.map((tea) => (
                <div key={tea.id} className="flex items-start justify-between rounded-2xl border border-atelier-border p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-atelier-title">{tea.name}</p>
                      <span className="rounded-full bg-atelier-chip px-2.5 py-1 text-[11px] font-semibold text-atelier-text-soft">
                        {tea.typeLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-atelier-text-muted">{tea.reason}</p>
                    {tea.meta ? (
                      <p className="mt-2 text-xs text-atelier-text-soft">{tea.meta}</p>
                    ) : null}
                  </div>
                  {tea.savedAt ? (
                    <span className="shrink-0 rounded-lg bg-atelier-chip px-2 py-1 text-xs text-atelier-text-soft">
                      {tea.savedAt}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-atelier-surface-muted p-5 text-center text-sm text-atelier-text-soft">
              저장된 블렌드가 없습니다. 앱에서 `savedTeas`가 추가되면 이곳에 표시됩니다.
            </div>
          )}
        </PageSection>
      </div>

      {/* 컨디션 노트 — 공개 범위 관리 */}
      <PageSection title="컨디션 노트" description="공개 범위를 조정하면 가족 화면에 즉시 반영됩니다">
        {/* 필터 */}
        {(() => {
          const memberNotes = localCareNotes;
          const parentCount = memberNotes.filter((n) => n.visibility === 'parent_visible').length;
          const adminCount = memberNotes.filter((n) => n.visibility === 'admin_only').length;
          const filteredNotes = noteFilter === 'all' ? memberNotes : memberNotes.filter((n) => n.visibility === noteFilter);

          return (
            <>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {([
                  { key: 'all' as const, label: '전체', count: memberNotes.length },
                  { key: 'parent_visible' as const, label: '가족 공개', count: parentCount },
                  { key: 'admin_only' as const, label: '내부 전용', count: adminCount },
                ]).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setNoteFilter(f.key)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      noteFilter === f.key
                        ? 'bg-atelier-deep-green text-atelier-surface'
                        : 'bg-atelier-surface-muted text-atelier-text-soft hover:bg-atelier-chip'
                    }`}
                  >
                    {f.label} {f.count}
                  </button>
                ))}
              </div>

              {/* 노트 리스트 */}
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`rounded-2xl p-4 text-sm ${
                      note.visibility === 'admin_only'
                        ? 'border border-dashed border-atelier-border-strong bg-atelier-surface-muted text-atelier-text-muted'
                        : 'border border-brand-primary-light bg-brand-primary-light/30 text-atelier-text'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* 공개 범위 토글 */}
                        <button
                          type="button"
                          onClick={() =>
                            setLocalCareNotes((prev) =>
                              prev.map((n) =>
                                n.id === note.id
                                  ? {
                                      ...n,
                                      visibility:
                                        n.visibility === 'admin_only'
                                          ? ('parent_visible' as const)
                                          : ('admin_only' as const),
                                    }
                                  : n,
                              ),
                            )
                          }
                          className={`group flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                            note.visibility === 'admin_only'
                              ? 'bg-atelier-border text-atelier-text-soft hover:bg-brand-error/20 hover:text-brand-error'
                              : 'bg-brand-primary-light text-brand-primary hover:bg-atelier-border hover:text-atelier-text-soft'
                          }`}
                        >
                          <span
                            className={`inline-block h-2 w-2 rounded-full transition ${
                              note.visibility === 'admin_only' ? 'bg-atelier-border-strong group-hover:bg-brand-error' : 'bg-brand-primary group-hover:bg-atelier-border-strong'
                            }`}
                          />
                          {note.visibility === 'admin_only' ? '내부 전용' : '가족 공개'}
                        </button>
                        <span className="text-xs text-atelier-text-soft">{note.createdAt}</span>
                      </div>
                      <span className="text-xs text-atelier-text-soft">클릭하여 전환</span>
                    </div>
                    <p>{note.content}</p>
                  </div>
                ))}
                {filteredNotes.length === 0 ? (
                  <p className="py-4 text-center text-sm text-atelier-text-soft">해당 범위의 노트가 없습니다.</p>
                ) : null}
              </div>
            </>
          );
        })()}

        {/* 관리자 내부 메모 */}
        <div className="mt-5 rounded-2xl border border-dashed border-atelier-border-strong bg-atelier-surface-muted p-5 text-sm text-atelier-text-muted">
          <p className="mb-2 text-xs font-semibold text-atelier-text-soft">관리자 내부 메모</p>
          {member.note}
        </div>

        {/* 노트 추가 */}
        <div className="mt-5">
          <div className="flex gap-3">
            <input
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="flex-1 rounded-xl border border-atelier-border bg-atelier-surface px-4 py-3 text-sm text-atelier-text outline-none transition placeholder:text-atelier-text-soft focus:border-atelier-deep-green"
              placeholder="새 컨디션 노트 입력…"
            />
            <button
              type="button"
              onClick={() => {
                if (newNoteText.trim().length === 0) return;
                setLocalCareNotes((prev) => [
                  {
                    id: `cn-new-${Date.now()}`,
                    memberId: member.id,
                    authorId: 'admin-001',
                    content: newNoteText.trim(),
                    visibility: 'admin_only' as const,
                    category: 'internal_memo' as const,
                    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  },
                  ...prev,
                ]);
                setNewNoteText('');
              }}
              className="shrink-0 rounded-xl bg-atelier-deep-green px-5 py-3 text-sm font-semibold text-atelier-surface transition hover:bg-atelier-deep-green/90"
            >
              추가
            </button>
          </div>
          <p className="mt-2 text-xs text-atelier-text-soft">새 노트는 기본적으로 '내부 전용'으로 생성됩니다. 추가 후 공개 범위를 변경할 수 있습니다.</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-brand-success/20 p-4 text-sm text-brand-success">건강 체크 기록</div>
          <div className="rounded-2xl bg-brand-primary-light/40 p-4 text-sm text-brand-primary">가족 브리핑 작성</div>
          <div className="rounded-2xl bg-atelier-chip p-4 text-sm text-atelier-text-muted">메모 추가</div>
        </div>
      </PageSection>
    </div>
  );
}
