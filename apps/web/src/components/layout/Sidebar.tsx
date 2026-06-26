import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Landmark,
  PanelLeft,
  LayoutDashboard,
  Droplets,
  TrendingUp,
  Shield,
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  LifeBuoy,
  ShieldCheck,
  FileCheck,
  Brain,
  Lock,
  Zap,
  Database,
  ChevronDown,
  ChevronRight,
  Settings,
  BookOpen,
} from 'lucide-react';
import { useModuleStore } from '@stores/moduleStore';
import { MODULES } from '@alm/shared';

const ICON_MAP: Record<string, React.ReactNode> = {
  'layout-dashboard': <LayoutDashboard size={18} />,
  'droplets': <Droplets size={18} />,
  'trending-up': <TrendingUp size={18} />,
  'shield': <Shield size={18} />,
  'alert-circle': <AlertCircle size={18} />,
  'arrow-left-right': <ArrowLeftRight size={18} />,
  'bar-chart-3': <BarChart3 size={18} />,
  'life-buoy': <LifeBuoy size={18} />,
  'shield-check': <ShieldCheck size={18} />,
  'file-check': <FileCheck size={18} />,
  'brain': <Brain size={18} />,
  'lock': <Lock size={18} />,
  'zap': <Zap size={18} />,
  'database': <Database size={18} />,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { expandedModules, toggleModuleExpanded, setCurrentModule } = useModuleStore();

  const currentPath = location.pathname;

  return (
    <aside
      className={`flex flex-col bg-bg-sidebar text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <Landmark size={24} className="text-primary-400 shrink-0" />
          {!collapsed && (
            <span className="font-semibold text-lg whitespace-nowrap">ALM Platform</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {MODULES.map((module) => {
          const isActive = currentPath.startsWith(`/${module.route}`);
          const isExpanded = expandedModules.includes(module.id);
          const hasChildren = 'children' in module && (module as any).children && (module as any).children.length > 0;

          return (
            <div key={module.id}>
              <Link
                to={`/${module.route}`}
                onClick={() => {
                  setCurrentModule(module.id, `/${module.route}`);
                  if (hasChildren) toggleModuleExpanded(module.id);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="shrink-0" style={{ color: module.color }}>
                  {ICON_MAP[module.icon] || <LayoutDashboard size={18} />}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 whitespace-nowrap">{module.label}</span>
                    {hasChildren && (
                      <span className="shrink-0">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    )}
                  </>
                )}
              </Link>

              {/* Child items */}
              {!collapsed && hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {(module as any).children?.map((child: any) => {
                    const childActive = currentPath === `/${child.route}`;
                    return (
                      <Link
                        key={child.id}
                        to={`/${child.route}`}
                        onClick={() => setCurrentModule(module.id, `/${child.route}`)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                          childActive
                            ? 'text-white bg-white/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                        <span className="whitespace-nowrap">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 py-3 px-2 space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </Link>
        <Link
          to="/docs"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <BookOpen size={18} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Documentation</span>}
        </Link>
      </div>
    </aside>
  );
}
