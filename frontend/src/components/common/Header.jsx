import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useNotifications from '../../hooks/useNotifications';

export default function Header() {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAllRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">ATIN</span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className="icon-btn"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="notif-title">Notifications</span>
                      {unreadCount > 0 && (
                        <button className="btn btn-sm btn-ghost" onClick={markAllRead}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <div className="notif-empty">No notifications</div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n._id}
                            className={`notif-item ${n.read ? '' : 'unread'}`}
                          >
                            <div className="notif-item-title">{n.title}</div>
                            <div className="notif-item-body">{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="user-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.username}</span>
                  <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={16} />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4rem;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          z-index: 1000;
        }
        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .header-logo {
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--accent-primary), #7c4dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-link {
          padding: 0.5rem 0.875rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .icon-btn {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          position: relative;
        }
        .icon-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 1.125rem;
          height: 1.125rem;
          padding: 0 0.3125rem;
          background: var(--error);
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem 0.375rem 0.375rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
          color: var(--text-primary);
        }
        .user-btn:hover {
          background: var(--bg-tertiary);
        }
        .avatar {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: var(--accent-primary);
          color: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
        }
        .user-dropdown-wrapper, .notif-wrapper {
          position: relative;
        }
        .dropdown-menu, .notif-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 200px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 1001;
          animation: fadeIn 0.15s ease;
        }
        .notif-dropdown {
          width: 360px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1rem;
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: background var(--transition-fast);
          width: 100%;
          text-align: left;
          border: none;
          background: none;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: var(--bg-tertiary);
        }
        .dropdown-divider {
          border: none;
          border-top: 1px solid var(--border-primary);
          margin: 0.25rem 0;
        }
        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .notif-title {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .notif-list {
          max-height: 360px;
          overflow-y: auto;
        }
        .notif-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-primary);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .notif-item:hover {
          background: var(--bg-tertiary);
        }
        .notif-item.unread {
          background: rgba(0, 212, 255, 0.04);
        }
        .notif-item-title {
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }
        .notif-item-body {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .notif-empty {
          padding: 2rem;
          text-align: center;
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }
          .header-nav.open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 4rem;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-primary);
            padding: 1rem;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .user-name {
            display: none;
          }
          .notif-dropdown {
            width: 320px;
            right: -4rem;
          }
        }
      `}</style>
    </header>
  );
}
