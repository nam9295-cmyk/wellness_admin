import { createBrowserRouter } from 'react-router-dom';
import { RequireRole } from './components/common/RequireRole';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MemberDetailPage } from './pages/MemberDetailPage';
import { MembersPage } from './pages/MembersPage';
import { ParentModePage } from './pages/ParentModePage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Admin-only routes
      {
        element: <RequireRole roles={['admin']} />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'members',
            element: <MembersPage />,
          },
          {
            path: 'members/:memberId',
            element: <MemberDetailPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
      // Shared routes (admin preview + parent access)
      {
        path: 'parent-mode',
        element: <ParentModePage />,
      },
    ],
  },
]);
