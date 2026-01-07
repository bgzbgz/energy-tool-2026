import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number; // 1-4 (current section)
  total: number; // Always 4
  percentage: number; // 0-100
}

export function ProgressIndicator({ current, total, percentage }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-ft-white border border-ft-border rounded-sm p-3 shadow-sm min-w-[140px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-monument text-sm text-ft-grey">
          {current}/{total} Complete
        </span>
        <span className="font-monument text-sm font-medium text-ft-black">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-ft-border rounded-full overflow-hidden">
        <div
          className="h-full bg-ft-black transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

