import Home from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ContentModeration from './components/admin/ContentModeration';
import AdminAnalytics from './components/admin/Analytics';

const routes = [
  { path: '/', component: Home, requiresAuth: false, requiresAdmin: false },
  { path: '/login', component: Login, requiresAuth: false, requiresAdmin: false },
  { path: '/register', component: Register, requiresAuth: false, requiresAdmin: false },
  { path: '/dashboard', component: Dashboard, requiresAuth: true, requiresAdmin: false },
  { path: '/profile', component: Profile, requiresAuth: true, requiresAdmin: false },
  { path: '/admin', component: AdminDashboard, requiresAuth: true, requiresAdmin: true },
  { path: '/admin/dashboard', component: AdminDashboard, requiresAuth: true, requiresAdmin: true },
  { path: '/admin/users', component: UserManagement, requiresAuth: true, requiresAdmin: true },
  { path: '/admin/content', component: ContentModeration, requiresAuth: true, requiresAdmin: true },
  { path: '/admin/analytics', component: AdminAnalytics, requiresAuth: true, requiresAdmin: true },
];

export default routes;
