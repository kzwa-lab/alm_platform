import { ReactNode } from 'react';
import { getStatusColor, getStatusBgColor } from '@alm/shared';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  status: 'green' | 'amber' | 'red' | 'neutral';
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function KpiCard({ title, value, subtitle, status, trend, trendValue, icon, children }: KpiCardProps) {
  const statusColor = getStatusColor(status);
  void getStatusBgColor(status);

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-muted mb-1">{title}</div>
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          {subtitle && <div className="text-xs text-text-muted mt-1">{subtitle}</div>}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-text-muted'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {icon && <div className="text-text-muted">{icon}</div>}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColor }}
            title={`Status: ${status}`}
          />
        </div>
      </div>
      {children && <div className="mt-4 pt-4 border-t border-border-light">{children}</div>}
    </div>
  );
}
