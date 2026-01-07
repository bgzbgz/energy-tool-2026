export interface StorageService {
  save(key: string, data: unknown): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  clear(key: string): Promise<void>;
}

