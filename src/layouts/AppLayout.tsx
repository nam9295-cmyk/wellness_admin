import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

const pageTitles: Record<string, string> = {
  '/': '대시보드',
  '/members': '회원 관리',
  '/parent-mode': '보호자 홈',
  '/settings': '설정',
};

export function AppLayout() {
  const location = useLocation();

  const currentTitle =
    location.pathname.startsWith('/members/') ? '회원 상세' : pageTitles[location.pathname] ?? '대시보드';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header title={currentTitle} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
