import { useAuth } from '../../contexts/AuthContext';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { role, toggleRole, isParent } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {isParent ? '우리 가족 케어' : '웰니스 케어 관리'}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleRole}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              isParent
                ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isParent ? '관리자로 전환' : '보호자로 전환'}
          </button>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isParent ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isParent ? '보호자' : '관리자'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {role === 'admin' ? '웹 대시보드' : '보호자 홈'}
          </span>
        </div>
      </div>
    </header>
  );
}
