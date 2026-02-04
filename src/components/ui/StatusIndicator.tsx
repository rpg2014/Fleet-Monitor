import { cn } from '../../lib/utils';
import type { DeviceStatus } from '../../types/api';

interface StatusIndicatorProps {
  status: DeviceStatus;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      pulse: 'animate-pulse-slow',
      label: 'Online',
    },
    offline: {
      color: 'bg-red-500',
      pulse: '',
      label: 'Offline',
    },
    loading: {
      color: 'bg-yellow-500',
      pulse: 'animate-pulse',
      label: 'Loading',
    },
    error: {
      color: 'bg-red-500',
      pulse: '',
      label: 'Error',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-2 h-2 rounded-full', config.color, config.pulse)} />
      <span className="text-xs text-gray-400">{config.label}</span>
    </div>
  );
}

interface StatusDotProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusDot({ status, size = 'md', className }: StatusDotProps) {
  const statusConfig = {
    online: 'bg-green-500 animate-pulse-slow',
    offline: 'bg-red-500',
    loading: 'bg-yellow-500 animate-pulse',
    error: 'bg-red-500',
  };

  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <div className={cn('rounded-full', sizes[size], statusConfig[status], className)} />
  );
}
