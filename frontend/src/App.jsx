import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ContentModeration from './components/admin/ContentModeration';
import AdminAnalytics from './components/admin/Analytics';
import useAuth from './hooks/useAuth';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner overlay />;

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children || <Outlet />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner overlay />;

  if (user) return <Navigate to="/dashboard" replace />;

  return children || <Outlet />;
}

function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">AI Technology Intelligence Network</h1>
          <p className="hero-subtitle">
            Monitor, analyze, and predict technology trends with AI-powered intelligence
          </p>
          <div className="hero-actions">
            <a href="/login" className="btn btn-primary">Get Started</a>
            <a href="/register" className="btn btn-outline">Create Account</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/content" element={<ContentModeration />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
