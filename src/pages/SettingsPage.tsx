import { PageSection } from '../components/common/PageSection';
import { settingsGroups } from '../data/mockData';

export function SettingsPage() {
  return (
    <PageSection title="설정" description="운영 환경을 관리하는 공간입니다">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingsGroups.map((group) => (
          <div key={group.title} className="rounded-2xl border border-slate-200 p-5">
            <h4 className="text-base font-semibold text-slate-900">{group.title}</h4>
            <div className="mt-4 space-y-2">
              {group.items.map((item) => (
                <div key={item} className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
