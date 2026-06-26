import { getStatusColor } from '@alm/shared';

interface TrafficLightProps {
  status: 'green' | 'amber' | 'red' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export function TrafficLight({ status, size = 'md', showLabel = false, label }: TrafficLightProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusLabels = {
    green: 'Compliant',
    amber: 'Warning',
    red: 'Breach',
    neutral: 'N/A',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full`}
        style={{ backgroundColor: getStatusColor(status) }}
      />
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: getStatusColor(status) }}>
          {label || statusLabels[status]}
        </span>
      )}
    </div>
  );
}
