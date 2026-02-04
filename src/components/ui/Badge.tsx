import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    success: 'bg-green-900 text-green-300 border-green-700',
    warning: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    error: 'bg-red-900 text-red-300 border-red-700',
    default: 'bg-gray-700 text-gray-300 border-gray-600',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
