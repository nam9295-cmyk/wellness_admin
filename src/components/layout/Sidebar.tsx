import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: '대시보드', end: true },
  { to: '/members', label: '회원 관리' },
  { to: '/parent-mode', label: '보호자 홈' },
  { to: '/settings', label: '설정' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">Wellness</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">관리자 대시보드</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map((item) => (
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
        <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
          <p className="font-semibold">초기 웹 구조 준비 완료</p>
          <p className="mt-1 text-slate-300">실데이터 연동 전, 더미 데이터로 화면 골격을 먼저 확인할 수 있습니다.</p>
        </div>
      </div>
    </aside>
  );
}
