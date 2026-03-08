import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/member';

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  roles: UserRole[];
};

const navigationItems: NavItem[] = [
  { to: '/', label: '대시보드', end: true, roles: ['admin'] },
  { to: '/members', label: '회원 관리', roles: ['admin'] },
  { to: '/parent-mode', label: '가족 홈', roles: ['admin', 'parent'] },
  { to: '/settings', label: '설정', roles: ['admin'] },
];

export function Sidebar() {
  const { role, isParent } = useAuth();

  const visibleItems = navigationItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">Wellness</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          {isParent ? '가족 홈' : '관리자 대시보드'}
        </h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-5">
        <div className={`rounded-2xl p-4 text-sm ${isParent ? 'bg-teal-600 text-teal-50' : 'bg-slate-900 text-slate-100'}`}>
          <p className="font-semibold">
            {isParent ? '가족 모드로 보고 있어요' : '초기 웹 구조 준비 완료'}
          </p>
          <p className={`mt-1 ${isParent ? 'text-teal-100' : 'text-slate-300'}`}>
            {isParent
              ? '내 가족의 오늘 컨디션을 확인해 보세요.'
              : '실데이터 연동 전, 더미 데이터로 화면 골격을 먼저 확인할 수 있습니다.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
