import type { StorageService } from '@/application/ports/StorageService';

export class LocalStorageService implements StorageService {
  async save(key: string, data: unknown): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some space.');
      }
      throw error;
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load from localStorage key "${key}":`, error);
      return null;
    }
  }

  async clear(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

export const localStorageService = new LocalStorageService();

