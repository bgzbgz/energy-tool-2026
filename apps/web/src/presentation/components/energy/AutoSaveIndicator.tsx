import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSaved?: Date;
}

export function AutoSaveIndicator({ status, lastSaved }: AutoSaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-ft-white border border-ft-border rounded-sm px-4 py-2 shadow-sm">
      {status === 'saving' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-ft-grey rounded-full animate-pulse" />
          <span className="font-monument text-xs text-ft-grey">Saving...</span>
        </div>
      )}
      
      {status === 'saved' && lastSaved && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="font-monument text-xs text-ft-grey">
            Saved at {formatTime(lastSaved)}
          </span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="font-monument text-xs text-red-500">Failed to save</span>
        </div>
      )}
    </div>
  );
}

