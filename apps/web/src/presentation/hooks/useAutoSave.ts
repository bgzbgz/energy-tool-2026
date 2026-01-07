import { useEffect, useRef, useState } from 'react';
import type { StorageService } from '@/application/ports/StorageService';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  storageKey: string;
  storageService?: StorageService;
  debounceMs?: number;
}

export function useAutoSave<T>(data: T, options: UseAutoSaveOptions) {
  const { storageKey, storageService = localStorageService, debounceMs = 2000 } = options;
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set status to saving
    setStatus('saving');

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await storageService.save(storageKey, data);
        setStatus('saved');
        setLastSaved(new Date());
        
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setStatus('error');
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, storageKey, storageService, debounceMs]);

  return { status, lastSaved };
}

