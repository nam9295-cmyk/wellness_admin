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
  { to: '/', label: '대시보드', end: true, roles: ['superAdmin', 'orgAdmin'] },
  { to: '/members', label: '회원 관리', roles: ['superAdmin', 'orgAdmin'] },
  { to: '/parent-mode', label: '가족 홈', roles: ['superAdmin', 'orgAdmin', 'parent'] },
  { to: '/settings', label: '설정', roles: ['superAdmin', 'orgAdmin'] },
];

export function Sidebar() {
  const { role, isParent, isSuperAdmin } = useAuth();

  const visibleItems = navigationItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">Wellness</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          {isParent ? '가족 홈' : isSuperAdmin ? '전체 관리자 대시보드' : '업체 관리자 대시보드'}
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
            {isParent ? '가족 모드로 보고 있어요' : isSuperAdmin ? '조직 전체를 볼 수 있어요' : '현재 조직 범위로 보고 있어요'}
          </p>
          <p className={`mt-1 ${isParent ? 'text-teal-100' : 'text-slate-300'}`}>
            {isParent
              ? '내 가족의 오늘 컨디션을 확인해 보세요.'
              : isSuperAdmin
                ? 'organizations / adminUsers / members 구조를 기준으로 전체 데이터를 관리할 수 있습니다.'
                : '현재 organizationId 기준으로 회원과 운영 데이터를 관리할 수 있습니다.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
