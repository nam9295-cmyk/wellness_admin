import { useState } from 'react';
import { PageSection } from '../components/common/PageSection';
import { settingsGroups } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizations } from '../hooks/useOrganizations';
import { seedAdminTestData } from '../lib/firebase/writes';

export function SettingsPage() {
  const { role, setRole, organizationId, setOrganizationId, isSuperAdmin, isOrgAdmin } = useAuth();
  const { organizations, refetch } = useOrganizations();
  const [seedStatus, setSeedStatus] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState(false);

  async function handleSeedTestData() {
    try {
      setIsSeeding(true);
      setSeedStatus('테스트 organization / admin / tester member 생성 중...');
      const result = await seedAdminTestData();
      setSeedStatus(`생성 완료: ${result.organizationIds.join(', ')}`);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : '테스트 데이터 생성 실패';
      setSeedStatus(`실패: ${message}`);
      console.error('[seedAdminTestData] failed:', err);
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageSection title="운영 설정" description="역할과 organization 스코프를 바꾸며 관리자 흐름을 바로 테스트할 수 있습니다">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5">
            <h4 className="text-base font-semibold text-atelier-title">현재 접근 스코프</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-atelier-text" htmlFor="role-select">
                  현재 역할
                </label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(event) => setRole(event.target.value as typeof role)}
                  className="w-full rounded-xl border border-atelier-border bg-atelier-surface-muted px-4 py-2.5 text-sm text-atelier-text outline-none transition focus:border-atelier-deep-green"
                >
                  <option value="superAdmin">superAdmin</option>
                  <option value="orgAdmin">orgAdmin</option>
                  <option value="parent">parent</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-atelier-text" htmlFor="organization-select">
                  organizationId
                </label>
                <select
                  id="organization-select"
                  value={organizationId ?? ''}
                  onChange={(event) => setOrganizationId(event.target.value || null)}
                  disabled={!isSuperAdmin && !isOrgAdmin}
                  className="w-full rounded-xl border border-atelier-border bg-atelier-surface-muted px-4 py-2.5 text-sm text-atelier-text outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-atelier-deep-green"
                >
                  <option value="">선택 안 함</option>
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name} ({organization.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-atelier-surface-muted p-4 text-sm text-atelier-text-soft">
              <p>현재 역할: <span className="font-semibold text-atelier-title">{role}</span></p>
              <p className="mt-1">현재 organization: <span className="font-semibold text-atelier-title">{organizationId ?? '없음'}</span></p>
            </div>
          </div>

          <div className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5">
            <h4 className="text-base font-semibold text-atelier-title">테스트 데이터 생성</h4>
            <p className="mt-2 text-sm text-atelier-text-muted">
              `org-test-alpha`, `org-test-beta`, superAdmin, orgAdmin, tester member 샘플을 한 번에 생성합니다.
            </p>
            <button
              type="button"
              onClick={handleSeedTestData}
              disabled={isSeeding}
              className="mt-4 rounded-xl bg-atelier-deep-green px-4 py-2.5 text-sm font-semibold text-atelier-surface shadow-sm transition hover:bg-atelier-deep-green/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSeeding ? '생성 중...' : '테스트 데이터 생성'}
            </button>
            <div className="mt-4 rounded-2xl bg-atelier-surface-muted p-4 text-sm text-atelier-text-soft">
              {seedStatus || '아직 생성하지 않았습니다.'}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="일반 설정" description="운영 환경을 관리하는 기본 설정 영역입니다">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsGroups.map((group) => (
            <div key={group.title} className="rounded-[24px] border border-atelier-border bg-atelier-surface p-5">
              <h4 className="text-base font-semibold text-atelier-title">{group.title}</h4>
              <div className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <div key={item} className="rounded-xl bg-atelier-chip px-3 py-3 text-sm text-atelier-text-soft">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}