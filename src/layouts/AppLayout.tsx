import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/members': 'Members',
  '/parent-mode': 'Parent Mode',
  '/settings': 'Settings',
};

export function AppLayout() {
  const location = useLocation();

  const currentTitle =
    location.pathname.startsWith('/members/') ? 'Member Detail' : pageTitles[location.pathname] ?? 'Dashboard';

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
