import { PageSection } from '../components/common/PageSection';
import { parentUpdates } from '../data/mockData';

export function ParentModePage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <PageSection title="보호자 모드 요약" description="보호자에게 보여줄 정보 구조를 미리 잡아두는 화면">
        <div className="space-y-4">
          {parentUpdates.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="미리보기 패널" description="추후 보호자 전용 요약 카드/알림 카드 자리">
        <div className="space-y-3">
          <div className="rounded-2xl bg-slate-900 p-4 text-sm text-white">오늘 식사, 복약, 활동 요약 카드</div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">최근 문의 응답 상태 카드</div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">중요 알림 이력 카드</div>
        </div>
      </PageSection>
    </div>
  );
}
