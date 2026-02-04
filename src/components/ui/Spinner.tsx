import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-600 border-t-primary-500', sizes[size], className)} />
  );
}

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = 'Loading...', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Spinner size="lg" />
      <p className="mt-4 text-gray-400 text-sm">{message}</p>
    </div>
  );
}
