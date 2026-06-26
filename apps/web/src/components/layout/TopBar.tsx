import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ClipboardList,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useThemeStore } from '@stores/themeStore';
import { useNotificationStore } from '@stores/notificationStore';
import { useAuthStore } from '@stores/authStore';
import { useState } from 'react';

export function TopBar() {
  const { isDark, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  // Generate breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-bg-primary border-b border-border-color">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary">
          <Menu size={20} />
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-text-muted" />
              <Link
                to={crumb.path}
                className={`transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search reports, metrics, ISINs, entities..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-bg-secondary border border-border-color text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs bg-bg-tertiary border border-border-color rounded text-text-muted">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <Bell size={20} className="text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>

        {/* Tasks */}
        <button className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors">
          <ClipboardList size={20} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
        >
          {isDark ? <Sun size={20} className="text-text-secondary" /> : <Moon size={20} className="text-text-secondary" />}
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-border-color">
          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
            {user?.role ? user.role.slice(0, 2).toUpperCase() : 'KA'}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-text-primary">
              {user?.role ? user.role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'K. Asante'}
            </div>
            <div className="text-xs text-text-muted">
              {user?.role === 'cro' ? 'CRO / Risk Committee Chair' : 'ALM Platform User'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  void onClose;
  const { notifications, markAsRead, dismissNotification } = useNotificationStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-bg-card rounded-xl border border-border-color shadow-dropdown z-50">
      <div className="p-4 border-b border-border-color">
        <h3 className="font-semibold text-text-primary">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-text-muted text-sm">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border-light hover:bg-bg-secondary transition-colors cursor-pointer ${
                !notification.read ? 'bg-bg-secondary/50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    notification.type === 'error'
                      ? 'bg-danger'
                      : notification.type === 'warning'
                      ? 'bg-warning'
                      : notification.type === 'success'
                      ? 'bg-success'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">{notification.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{notification.message}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString('en-GB', { timeZone: 'GMT' })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                  className="text-text-muted hover:text-text-primary"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-border-color">
        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
}
