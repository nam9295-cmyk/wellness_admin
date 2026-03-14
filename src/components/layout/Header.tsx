import { useAuth } from '../../contexts/AuthContext';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { role, toggleRole, isParent, isSuperAdmin, isOrgAdmin, organizationId } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-atelier-border bg-atelier-surface/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-atelier-text-soft">
            {isParent ? '우리 가족 컨디션' : '웰니스 컨디션 관리'}
          </p>
          <h2 className="text-2xl font-semibold text-atelier-title">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleRole}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              isParent
                ? 'bg-atelier-surface-muted text-atelier-deep-green border border-atelier-border hover:bg-atelier-border'
                : 'bg-brand-primary-light text-brand-text hover:bg-brand-primary/40'
            }`}
          >
            {isParent ? '관리자 모드로 전환' : '가족 모드로 전환'}
          </button>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isParent ? 'bg-atelier-surface-muted text-atelier-deep-green border border-atelier-border' : 'bg-brand-primary-light text-brand-text'
            }`}
          >
            {isParent ? '가족' : isSuperAdmin ? '전체 관리자' : isOrgAdmin ? '업체 관리자' : '관리자'}
          </span>
          <span className="rounded-full bg-atelier-chip px-3 py-1 text-xs font-semibold text-atelier-text">
            {isParent ? '가족 홈' : organizationId ?? role}
          </span>
        </div>
      </div>
    </header>
  );
}
