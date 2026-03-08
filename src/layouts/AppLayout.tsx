import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const adminPageTitles: Record<string, string> = {
  '/': '대시보드',
  '/members': '회원 관리',
  '/parent-mode': '가족 홈',
  '/settings': '설정',
};

const parentPageTitles: Record<string, string> = {
  '/parent-mode': '우리 가족',
};

export function AppLayout() {
  const location = useLocation();
  const { isParent } = useAuth();

  const titles = isParent ? parentPageTitles : adminPageTitles;

  const currentTitle = location.pathname.startsWith('/members/')
    ? '회원 상세'
    : titles[location.pathname] ?? (isParent ? '우리 가족' : '대시보드');

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
